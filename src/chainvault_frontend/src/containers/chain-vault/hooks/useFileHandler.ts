import { useToast } from "@tixia/design-system";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { chainvault_backend } from "declarations/chainvault_backend";
import {
  encrypt,
  decrypt,
  hash256,
  decodeBase64,
  generateRandomKey,
} from "../../../lib/crypto";

// Interface for stored file information
interface StoredFileInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadKey: string;
  uploadDate: number; // timestamp
}

export const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [storedFiles, setStoredFiles] = useState<StoredFileInfo[]>([]);

  const [modalOpen, setModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [view, setView] = useState("grid");

  const { showToast } = useToast();

  const CHUNK_SIZE = 270000; // ~270KB chunks
  const CONCURRENT_UPLOADS = 5;
  const MAX_RETRIES = 3;

  const closeModal = () => {
    setModalOpen("");
    setSelectedItem(null);
  };

  const openModal = (modal: string) => setModalOpen(modal);

  useEffect(() => {
    const generateKey = generateRandomKey(16);
    setKey(generateKey);

    // Load stored files from localStorage when component mounts
    const loadStoredFiles = () => {
      const storedFilesData = localStorage.getItem("chainvault-files");
      if (storedFilesData) {
        try {
          const parsedFiles = JSON.parse(storedFilesData);
          setStoredFiles(parsedFiles);
        } catch (error) {
          console.error("Error parsing stored files:", error);
        }
      }
    };

    loadStoredFiles();
  }, []);

  const readFileChunkAsBase64 = (chunk: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(chunk);
    });
  };

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

      const base64Chunk = await readFileChunkAsBase64(chunk);
      const encryptedChunk = await encrypt(base64Chunk, fileId);
      const bigIntChunkId = BigInt(chunkId);

      return await chainvault_backend.uploadChunk(
        fileId,
        bigIntChunkId,
        encryptedChunk
      );
    } catch (error) {
      console.error(`Error processing chunk ${chunkId}:`, error);
      return false;
    }
  };

  // Function to save file info to localStorage
  const saveFileToLocalStorage = (
    fileId: string,
    fileName: string,
    uploadKey: string,
    fileSize: number
  ) => {
    const newFileInfo: StoredFileInfo = {
      fileId,
      fileName,
      fileSize,
      uploadKey,
      uploadDate: Date.now(),
    };

    const updatedFiles = [...storedFiles, newFileInfo];
    setStoredFiles(updatedFiles);

    try {
      localStorage.setItem("chainvault-files", JSON.stringify(updatedFiles));
    } catch (error) {
      console.error("Error saving file to localStorage:", error);
      showToast({
        title: "Warning",
        description: "Could not save file info to local storage",
        variant: "warning",
      });
    }
  };

  // Function to remove a file from localStorage
  const removeFileFromLocalStorage = (fileId: string) => {
    const updatedFiles = storedFiles.filter((file) => file.fileId !== fileId);
    setStoredFiles(updatedFiles);

    try {
      localStorage.setItem("chainvault-files", JSON.stringify(updatedFiles));
      return true;
    } catch (error) {
      console.error("Error removing file from localStorage:", error);
      showToast({
        title: "Warning",
        description: "Could not remove file info from local storage",
        variant: "warning",
      });
      return false;
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, key }: { file: File; key: string }) => {
      if (!file || !key) {
        throw new Error("No file or key selected");
      }

      const hashedRandomKey = await hash256(key);
      const fileId = hashedRandomKey;
      const totalSize: bigint = BigInt(file.size);
      const expirationSeconds = 60; // 1 minute

      await chainvault_backend.beginFileUpload(fileId, file.name, totalSize, [
        BigInt(expirationSeconds),
      ]);

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let uploadedChunks = 0;
      const failedChunks: number[] = [];

      // Process chunks in batches
      for (let i = 0; i < totalChunks; i += CONCURRENT_UPLOADS) {
        const uploadPromises = [];
        const currentChunks: number[] = [];

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

        const results = await Promise.all(uploadPromises);

        results.forEach((success, index) => {
          if (!success) {
            failedChunks.push(currentChunks[index]);
          }
        });

        uploadedChunks += results.filter((success) => success).length;
        setUploadProgress(Math.floor((uploadedChunks / totalChunks) * 100));
      }

      // Handle retries for failed chunks
      let retryAttempt = 0;
      while (failedChunks.length > 0 && retryAttempt < MAX_RETRIES) {
        retryAttempt++;
        const chunksToRetry = [...failedChunks];
        failedChunks.length = 0;

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

          retryResults.forEach((success, index) => {
            if (!success) {
              failedChunks.push(currentRetryChunks[index]);
            } else {
              uploadedChunks++;
              setUploadProgress(
                Math.floor((uploadedChunks / totalChunks) * 100)
              );
            }
          });
        }
      }

      if (failedChunks.length > 0) {
        throw new Error(
          `Failed to upload ${failedChunks.length} chunks after multiple attempts.`
        );
      }

      return { fileId, fileName: file.name, key };
    },
    onSuccess: (result) => {
      // Generate a new key for the next upload
      const newKey = generateRandomKey(16);
      setKey(newKey);

      // Save file info to localStorage
      saveFileToLocalStorage(
        result.fileId,
        result.fileName,
        result.key,
        file?.size || 0
      );

      showToast({
        title: "Success",
        variant: "success",
        description: "File uploaded successfully",
      });
      openModal("success");
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        description: error.message || "Error during upload",
        variant: "error",
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (downloadKey: string) => {
      if (!downloadKey) {
        throw new Error("No key provided for download");
      }

      const hashedDownloadKey = await hash256(downloadKey);
      const fileId = hashedDownloadKey;

      const fileInfoResponse = await chainvault_backend.getFileInfo(fileId);
      if (!fileInfoResponse?.[0]) {
        throw new Error("File not found");
      }

      const fileInfo = fileInfoResponse[0];
      const totalChunks = fileInfo.totalChunks;
      const chunks: ArrayBuffer[] = [];

      for (let chunkId = 0; chunkId < totalChunks; chunkId++) {
        const bigIntChunkId = BigInt(chunkId);
        const chunkResponse = await chainvault_backend.getFileChunk(
          fileId,
          bigIntChunkId
        );

        if (!chunkResponse[0]) {
          throw new Error(`Chunk ${chunkId} not found`);
        }

        const decryptedChunk = await decrypt(chunkResponse[0], fileId);
        const binaryChunk = decodeBase64(decryptedChunk);
        chunks.push(binaryChunk.buffer);

        setDownloadProgress(
          Math.floor(((chunkId + 1) / Number(totalChunks)) * 100)
        );
      }

      return {
        chunks,
        fileName: fileInfo.name || "downloaded_file",
      };
    },
    onSuccess: (data) => {
      const blob = new Blob(data.chunks, { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);

      showToast({
        title: "Success",
        description: "File downloaded successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        description: error.message || "Error during download",
        variant: "error",
      });
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && key) {
      setFile(selectedFile);
      setUploadProgress(0);
      setUploadKey(key);

      try {
        await uploadMutation.mutateAsync({ file: selectedFile, key });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        // Error handling is done in mutation callbacks
      }
    } else {
      showToast({
        title: "Error",
        description: "No file or key selected",
        variant: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (!file || !key) {
      showToast({
        title: "Error",
        description: "No file or key selected",
        variant: "error",
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync({ file, key });
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleDownload = async (downloadKey: string, e: React.FormEvent) => {
    e.preventDefault();
    // setIsDownloading(true);
    setDownloadProgress(0);

    try {
      await downloadMutation.mutateAsync(downloadKey);
    } catch (error) {
      // Error handling is done in mutation callbacks
    } finally {
      // setIsDownloading(false);
      setModalOpen("");
    }
  };

  return {
    file,
    key: key || "",
    uploadKey,
    setFile,
    setKey,
    handleFileChange,
    handleSubmit,
    handleDownload,
    uploadMutation,
    downloadMutation,
    modalOpen,
    closeModal,
    openModal,
    selectedItem,
    setSelectedItem,
    view,
    setView,
    fileInputRef,
    uploadProgress,
    downloadProgress,
    storedFiles,
    saveFileToLocalStorage,
    removeFileFromLocalStorage,
  };
};
