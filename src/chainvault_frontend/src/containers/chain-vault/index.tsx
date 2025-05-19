import { useEffect, useState } from "react";
import { chainvault_backend } from "declarations/chainvault_backend";
import {
  decrypt,
  encrypt,
  generateRandomKey,
  encodeBase64,
  decodeBase64,
  hash256,
} from "../../lib/crypto";

export function ChainVault() {
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

    // TODO: Need a better way to handle file reading
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target?.result;
      if (fileContent) {
        // Convert file to base64
        const base64Content = encodeBase64(fileContent as string);
        console.log("File content:", base64Content);

        const hashedRandomKey = await hash256(key);

        // Encrypt the file content
        const encryptedContent = await encrypt(base64Content, hashedRandomKey);
        console.log("Encrypted content:", encryptedContent);

        // Send the encrypted content to the backend
        const response = await chainvault_backend.add(
          hashedRandomKey,
          encryptedContent
        );
        console.log("Response from backend:", response);
      } else {
        console.error("Failed to read file content");
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsText(file);
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
      console.log("Encrypted content from backend:", encryptedContent[0]);

      // Decrypt the content
      const decryptedContent = await decrypt(
        encryptedContent[0],
        hashedDownloadKey
      );
      console.log("Decrypted content:", decryptedContent);

      // Decrypted content is in base64, convert it back to arraybuffer
      const decodedContent = decodeBase64(decryptedContent);
      console.log("Decoded content:", decodedContent);

      // Convert the decoded content to a Blob and create a download link
      const bytes = new Uint8Array(decodedContent.length);
      for (let i = 0; i < decodedContent.length; i++) {
        bytes[i] = decodedContent.charCodeAt(i);
      }

      // Create a Blob and download it
      // Note: You might want to set the correct MIME type based on the file type
      // For example, if you know the file type, you can set it here
      const blob = new Blob([bytes], { type: "application/x-bittorrent" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_file"; // You can set a default filename here
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error during download:", err);
    }
  };

  return (
    <main>
      <h1>Chain Vault</h1>

      <section>
        <h2>Upload</h2>
        <p>Here is your key: {key} (save it somewhere safe)</p>

        <input type="file" onChange={handleFileChange} />

        <button type="submit" onClick={handleSubmit}>
          Save
        </button>
      </section>

      <section>
        <h2>Download</h2>
        <p>Enter the key to download a file.</p>
        <input
          type="text"
          placeholder="Key"
          value={downloadKey}
          onChange={(e) => setDownloadKey(e.target.value)}
        />
        <button onClick={handleDownload}>Download</button>
      </section>
    </main>
  );
}
