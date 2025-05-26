import { useEffect, useState } from "react";
import { chainvault_backend } from "declarations/chainvault_backend";
import {
  decrypt,
  encrypt,
  generateRandomKey,
  decodeBase64,
  hash256,
} from "../../lib/crypto";
import { Button, Input, Text, Card } from "@tixia/design-system";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [downloadKey, setDownloadKey] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const CHUNK_SIZE = 270000; // ~270KB chunks

  useEffect(() => {
    const generatedKey = generateRandomKey(16);
    setKey(generatedKey);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    if (!key) {
      console.error("No key");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const hashedRandomKey = await hash256(key);
      const fileId = hashedRandomKey;
      const totalSize: bigint = BigInt(file.size);

      // Initialize file upload
      await chainvault_backend.beginFileUpload(fileId, file.name, totalSize);

      // Prepare to read file in chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let uploadedChunks = 0;

      // Define concurrency level - adjust based on performance testing
      const CONCURRENT_UPLOADS = 5;
      // Max retry attempts for failed chunks
      const MAX_RETRIES = 3;

      // Track failed chunks for retry
      const failedChunks: number[] = [];

      // Process chunks in batches
      for (let i = 0; i < totalChunks; i += CONCURRENT_UPLOADS) {
        // Create a batch of promises for parallel processing
        const uploadPromises = [];
        const currentChunks: number[] = [];

        // Generate promises for each chunk in the current batch
        for (let j = 0; j < CONCURRENT_UPLOADS && i + j < totalChunks; j++) {
          const chunkId = i + j;
          currentChunks.push(chunkId);
          const uploadPromise = processAndUploadChunk(
            file,
            fileId,
            chunkId,
            CHUNK_SIZE
          );
          uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads in this batch to complete
        const results = await Promise.all(uploadPromises);

        // Track which chunks failed
        results.forEach((success, index) => {
          if (!success) {
            failedChunks.push(currentChunks[index]);
          }
        });

        // Update progress
        uploadedChunks += results.filter((success) => success).length;
        setUploadProgress(Math.floor((uploadedChunks / totalChunks) * 100));
      }

      // Handle retries for failed chunks
      let retryAttempt = 0;
      while (failedChunks.length > 0 && retryAttempt < MAX_RETRIES) {
        retryAttempt++;

        // Process failed chunks in batches
        const chunksToRetry = [...failedChunks];
        failedChunks.length = 0; // Clear the array for the next iteration

        for (let i = 0; i < chunksToRetry.length; i += CONCURRENT_UPLOADS) {
          const uploadPromises = [];
          const currentRetryChunks: number[] = [];

          for (
            let j = 0;
            j < CONCURRENT_UPLOADS && i + j < chunksToRetry.length;
            j++
          ) {
            const chunkId = chunksToRetry[i + j];
            currentRetryChunks.push(chunkId);
            const uploadPromise = processAndUploadChunk(
              file,
              fileId,
              chunkId,
              CHUNK_SIZE
            );
            uploadPromises.push(uploadPromise);
          }

          const retryResults = await Promise.all(uploadPromises);

          // Track which chunks failed again
          retryResults.forEach((success, index) => {
            if (!success) {
              failedChunks.push(currentRetryChunks[index]);
            } else {
              // Update progress for successful retries
              uploadedChunks++;
              setUploadProgress(
                Math.floor((uploadedChunks / totalChunks) * 100)
              );
            }
          });
        }
      }

      // Check if any chunks still failed after all retries
      if (failedChunks.length > 0) {
        console.error(
          `Upload incomplete. ${failedChunks.length} chunks failed after ${MAX_RETRIES} retries.`
        );
        throw new Error(
          `Failed to upload ${failedChunks.length} chunks after multiple attempts.`
        );
      }
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Extract chunk processing and uploading logic to a separate function
  const processAndUploadChunk = async (
    file: File,
    fileId: string,
    chunkId: number,
    chunkSize: number
  ): Promise<boolean> => {
    try {
      const start = chunkId * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // Read chunk as base64
      const base64Chunk = await readFileChunkAsBase64(chunk);

      // Encrypt each chunk
      const encryptedChunk = await encrypt(base64Chunk, fileId);

      // Upload chunk
      const bigIntChunkId = BigInt(chunkId);
      const success = await chainvault_backend.uploadChunk(
        fileId,
        bigIntChunkId,
        encryptedChunk
      );

      return success;
    } catch (error) {
      console.error(`Error processing chunk ${chunkId}:`, error);
      return false;
    }
  };

  const readFileChunkAsBase64 = (chunk: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Extract the base64 part (remove data:*/*;base64, prefix)
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(chunk);
    });
  };

  const handleDownload = async (e: any) => {
    e.preventDefault();

    if (!downloadKey) {
      console.error("No key provided for download");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const hashedDownloadKey = await hash256(downloadKey);
      const fileId = hashedDownloadKey;

      // Get file info
      const fileInfoResponse = await chainvault_backend.getFileInfo(fileId);
      if (!fileInfoResponse) {
        throw new Error("File not found");
      }

      const fileInfo = fileInfoResponse[0];
      if (!fileInfo) {
        throw new Error("File not found");
      }

      const totalChunks = fileInfo.totalChunks;

      // Create array to hold all chunks
      const chunks: Uint8Array[] = [];

      // Download each chunk
      for (let chunkId = 0; chunkId < totalChunks; chunkId++) {
        const bigIntChunkId = BigInt(chunkId);
        const chunkResponse = await chainvault_backend.getFileChunk(
          fileId,
          bigIntChunkId
        );
        if (!chunkResponse[0]) {
          throw new Error(`Chunk ${chunkId} not found`);
        }

        // Decrypt chunk
        const decryptedChunk = await decrypt(chunkResponse[0], fileId);

        // Convert base64 to binary
        const binaryChunk = decodeBase64(decryptedChunk);
        chunks.push(binaryChunk);

        const intTotalChunks = Number(totalChunks);
        setDownloadProgress(Math.floor(((chunkId + 1) / intTotalChunks) * 100));
      }

      // Combine all chunks and create a download link
      const blob = new Blob(chunks, { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo.name || "downloaded_file";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    } catch (err) {
      console.error("Error during download:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4 bg-white" variant="ghost">
      {/* Upload */}
      <Card className="w-fit flex flex-col gap-2" shadow="sm">
        <Text variant="h2">Upload</Text>
        <div className="flex gap-2 mb-2">
          <Text variant="p">
            Here is your key:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {key}
            </span>
          </Text>
          <Button
            onClick={() => {
              if (key) {
                navigator.clipboard.writeText(key);
                // Optional: Add a toast notification here
              }
            }}
            variant="outline-primary"
            size="xs"
          >
            Copy
          </Button>
        </div>

        <Card className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Input type="file" variant="ghost" onChange={handleFileChange} />
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="primary"
              disabled={isUploading || !file}
            >
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </div>

          {isUploading && (
            <div className="w-full mt-2">
              {/* <Progress value={uploadProgress} max={100} /> */}
              <Text variant="caption" className="text-right">
                {uploadProgress}%
              </Text>
            </div>
          )}
        </Card>
      </Card>

      {/* Download */}
      <Card className="w-fit flex flex-col gap-2" shadow="sm">
        <Text variant="h2">Download</Text>
        <Text variant="p">Enter the key to download a file.</Text>
        <Input
          type="text"
          placeholder="Key"
          value={downloadKey}
          onChange={(e) => setDownloadKey(e.target.value)}
          fullWidth
        />
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !downloadKey}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Button>

        {isDownloading && (
          <div className="w-full mt-2">
            {/* <Progress value={downloadProgress} max={100} /> */}
            <Text variant="caption" className="text-right">
              {downloadProgress}%
            </Text>
          </div>
        )}
      </Card>
    </Card>
  );
}
