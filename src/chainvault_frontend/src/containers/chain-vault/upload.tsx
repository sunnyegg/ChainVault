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

  useEffect(() => {
    const generateKey = generateRandomKey(16);
    setKey(generateKey);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    console.log("File selected:", selectedFile);
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

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result;
        if (fileContent) {
          // Get the base64 string
          const base64String = (fileContent as string).split(",")[1];

          const hashedRandomKey = await hash256(key);

          // Encrypt the file content
          const encryptedContent = await encrypt(base64String, hashedRandomKey);

          // Send the encrypted content to the backend
          const response = await chainvault_backend.add(
            hashedRandomKey,
            encryptedContent
          );
          console.log("Response from backend:", response);
        } else {
          console.error("Failed to read file content");
        }
      } catch (error) {
        console.error("Error during encryption:", error);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (e: any) => {
    e.preventDefault();

    if (!downloadKey) {
      console.error("No key provided for download");
      return;
    }

    try {
      const hashedDownloadKey = await hash256(downloadKey);

      // Fetch the encrypted content from the backend using the provided key
      const encryptedContent = await chainvault_backend.get(hashedDownloadKey);
      if (!encryptedContent.length) {
        console.error("No content found for the provided key");
        return;
      }

      // Decrypt the content
      const decryptedContent = await decrypt(
        encryptedContent[0],
        hashedDownloadKey
      );

      // Decrypted content is the base64 string
      // Convert base64 string back to binary
      const bytes = decodeBase64(decryptedContent);
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_file"; // You can set a default filename here
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0); // Clean up the URL object
    } catch (err) {
      console.error("Error during download:", err);
    }
  };

  return (
    <Card className="flex flex-col gap-4" variant="ghost">
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

        <Card className="flex gap-2 items-center">
          <Input type="file" variant="ghost" onChange={handleFileChange} />
          <Button type="submit" onClick={handleSubmit} variant="primary">
            Save
          </Button>
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
        <Button onClick={handleDownload}>Download</Button>
      </Card>
    </Card>
  );
}
