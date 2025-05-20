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

export const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState("grid");

  const { showToast } = useToast();

  const closeModal = () => {
    setModalOpen("");
    setSelectedItem(null);
  };

  const openModal = (modal: string) => setModalOpen(modal);

  useEffect(() => {
    const generateKey = generateRandomKey(16);
    setKey(generateKey);
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async ({
      fileContent,
      hashedKey,
    }: {
      fileContent: string;
      hashedKey: string;
    }) => {
      const encryptedContent = await encrypt(fileContent, hashedKey);
      return chainvault_backend.add(hashedKey, encryptedContent);
    },
    onSuccess: () => {
      showToast({
        title: "Success",
        variant: "success",
        description: "File uploaded successfully",
      });
      openModal("success");
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (hashedKey: string) => {
      const encryptedContent = await chainvault_backend.get(hashedKey);
      if (!encryptedContent.length) {
        showToast({
          title: "Error",
          description: "No content found for the provided key",
          variant: "error",
        });
        throw new Error("No content found for the provided key");
      }
      return encryptedContent[0];
    },
    onSuccess: () => {
      showToast({
        title: "Success",
        description: "File downloaded successfully",
        variant: "success",
      });
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && key) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const fileContent = event.target?.result;
          if (fileContent) {
            const base64String = (fileContent as string).split(",")[1];
            const hashedRandomKey = await hash256(key);
            setUploadKey(key);
            await uploadMutation.mutateAsync({
              fileContent: base64String,
              hashedKey: hashedRandomKey,
            });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        } catch (error) {
          showToast({
            title: "Error",
            description: "Error during upload",
            variant: "error",
          });
        }
      };
      reader.onerror = (error) => {
        showToast({
          title: "Error",
          description: "Error reading file",
          variant: "error",
        });
      };
      reader.readAsDataURL(selectedFile);
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

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result;
        if (fileContent) {
          const base64String = (fileContent as string).split(",")[1];
          const hashedRandomKey = await hash256(key);
          await uploadMutation.mutateAsync({
            fileContent: base64String,
            hashedKey: hashedRandomKey,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          description: "Error during upload",
          variant: "error",
        });
      }
    };
    reader.onerror = (error) => {
      showToast({
        title: "Error",
        description: "Error reading file",
        variant: "error",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (downloadKey: string, e: React.FormEvent) => {
    e.preventDefault();

    if (!downloadKey) {
      showToast({
        title: "Error",
        description: "No key provided for download",
        variant: "error",
      });
      return;
    }

    try {
      const hashedDownloadKey = await hash256(downloadKey);
      const encryptedContent = await downloadMutation.mutateAsync(
        hashedDownloadKey
      );

      const decryptedContent = await decrypt(
        encryptedContent,
        hashedDownloadKey
      );
      const bytes = decodeBase64(decryptedContent);
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "downloaded_file";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    } catch (err) {
      showToast({
        title: "Error",
        description: "Error during download",
        variant: "error",
      });
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
  };
};
