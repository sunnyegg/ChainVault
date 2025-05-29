import { Card, Text, ErrorWrapper, useToast } from "@tixia/design-system";
import { DUMMY_FILES, TYPE_ICONS } from "../../constants";
import { ModalDownload } from "./modals/modal-download";
import { List } from "./fragments/list";
import { ListGrid } from "./fragments/list-grid";
import { Filter } from "./fragments/filter";
import { ModalUploadSuccess } from "./modals/modal-upload-success";
import { useFileHandler } from "./hooks/useFileHandler";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper function to get file type from filename
const getFileType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  if (Object.keys(TYPE_ICONS).includes(extension)) {
    return extension;
  }
  return "doc"; // Default file type if extension is not recognized
};

// Helper function to format file for display
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Calculate if file is expired (60 seconds from upload date)
const isFileExpired = (uploadDate: number): boolean => {
  const expirationTime = uploadDate + 60 * 1000; // 60 seconds in milliseconds
  return Date.now() > expirationTime;
};

// Get remaining time until expiration
const getRemainingTime = (uploadDate: number): string => {
  const expirationTime = uploadDate + 60 * 1000; // 60 seconds in milliseconds
  const remainingMs = expirationTime - Date.now();

  if (remainingMs <= 0) {
    return "Expired";
  }

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  return `${remainingSeconds} seconds`;
};

// Interface for stored file information (matching the type from useFileHandler)
interface StoredFileInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadKey: string;
  uploadDate: number; // timestamp
}

// Interface for formatted file with UI-specific properties
interface FormattedFile {
  name: string;
  type: string;
  size: number;
  key_: string;
  uploadDate: string;
  fileId: string;
  expired: boolean;
  remainingTime: string;
}

const formatStoredFile = (file: any) => {
  const expired = isFileExpired(file.uploadDate);
  const remainingTime = getRemainingTime(file.uploadDate);

  return {
    name: file.fileName,
    type: getFileType(file.fileName),
    size: file.fileSize,
    key_: file.uploadKey,
    uploadDate: formatDate(file.uploadDate),
    fileId: file.fileId,
    expired,
    remainingTime,
  };
};

export const Files = () => {
  const {
    modalOpen,
    selectedItem,
    setSelectedItem,
    view,
    closeModal,
    openModal,
    setView,
    handleFileChange,
    handleDownload,
    uploadMutation,
    downloadMutation,
    uploadKey,
    uploadProgress,
    downloadProgress,
    storedFiles,
    removeFileFromLocalStorage,
  } = useFileHandler();

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State to force UI updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Periodically check for expired files and update UI
  useEffect(() => {
    // Update every second to refresh expiration times
    const intervalId = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle file deletion events from the modal
  useEffect(() => {
    const handleFileDelete = (event: CustomEvent) => {
      const fileId = event.detail?.fileId;
      if (fileId) {
        removeFileFromLocalStorage(fileId);
      }
    };

    // Add event listener
    document.addEventListener("delete-file", handleFileDelete as EventListener);

    // Cleanup
    return () => {
      document.removeEventListener(
        "delete-file",
        handleFileDelete as EventListener
      );
    };
  }, [removeFileFromLocalStorage]);

  // Helper function to handle expired files
  const handleFileSelection = (
    file: StoredFileInfo,
    formattedFile: FormattedFile
  ) => {
    // If file is expired, delete it instead of opening modal
    if (formattedFile.expired) {
      removeFileFromLocalStorage(file.fileId);
      showToast({
        title: "File Removed",
        description: "Expired file has been deleted from your vault",
        variant: "info",
      });
    } else {
      setSelectedItem(formattedFile);
      openModal("action");
    }
  };

  // Override the original openModal function to check for expired files
  const handleOpenModal = (modal: string, file?: FormattedFile) => {
    if (file && modal === "action" && file.expired) {
      // Get the original fileId from storedFiles
      const originalFile = storedFiles.find((f) => f.fileId === file.fileId);
      if (originalFile) {
        removeFileFromLocalStorage(originalFile.fileId);
        showToast({
          title: "File Removed",
          description: "Expired file has been deleted from your vault",
          variant: "info",
        });
      }
    } else {
      openModal(modal);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Filter
          openModal={openModal}
          view={view}
          setView={setView}
          handleFileChange={handleFileChange}
          uploadMutation={uploadMutation}
          fileInputRef={fileInputRef}
          uploadProgress={uploadProgress}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        {view === "list" ? (
          <Card
            className={`${
              storedFiles.length
                ? "grid gap-2"
                : "flex items-center justify-center"
            } bg-white min-h-[200px]`}
          >
            {!!storedFiles.length ? (
              storedFiles.map((file) => {
                const formattedFile = formatStoredFile(file);
                return (
                  <div key={file.fileId} className="relative">
                    <List
                      name={formattedFile.name}
                      type={formattedFile.type}
                      size={formattedFile.size}
                      uploadDate={formattedFile.uploadDate}
                      expired={formattedFile.expired}
                      remainingTime={formattedFile.remainingTime}
                      setSelectedItem={() =>
                        handleFileSelection(file, formattedFile)
                      }
                      openModal={(modal) =>
                        handleOpenModal(modal, formattedFile)
                      }
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFileFromLocalStorage(file.fileId);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <ErrorWrapper
                customImage="/negative_case/search-not-found.svg"
                customMessage="No files in the vault"
                variant="data-not-found"
              />
            )}
          </Card>
        ) : (
          <Card
            className={`${
              storedFiles.length
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                : "flex items-center justify-center"
            } bg-white min-h-[200px]`}
          >
            {!!storedFiles.length ? (
              storedFiles.map((file) => {
                const formattedFile = formatStoredFile(file);
                return (
                  <div key={file.fileId} className="relative">
                    <ListGrid
                      name={formattedFile.name}
                      type={formattedFile.type}
                      size={formattedFile.size}
                      uploadDate={formattedFile.uploadDate}
                      expired={formattedFile.expired}
                      remainingTime={formattedFile.remainingTime}
                      setSelectedItem={() =>
                        handleFileSelection(file, formattedFile)
                      }
                      openModal={(modal) =>
                        handleOpenModal(modal, formattedFile)
                      }
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFileFromLocalStorage(file.fileId);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <ErrorWrapper
                customImage="/negative_case/search-not-found.svg"
                customMessage="No files in the vault"
                variant="data-not-found"
              />
            )}
          </Card>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Text variant="caption" className="text-center">
          Powered by <span className="font-bold text-primary">ChainVault</span>
        </Text>
      </motion.div>
      <ModalDownload
        downloadProgress={downloadProgress}
        isOpen={modalOpen === "action"}
        onClose={() => {
          // If the selected file is expired, delete it when closing the modal
          if (selectedItem?.expired) {
            const originalFile = storedFiles.find(
              (f) => f.fileId === selectedItem.fileId
            );
            if (originalFile) {
              removeFileFromLocalStorage(originalFile.fileId);
            }
          }
          closeModal();
        }}
        item={selectedItem}
        handleDownload={handleDownload}
        downloadMutation={downloadMutation}
      />
      <ModalUploadSuccess
        isOpen={modalOpen === "success"}
        onClose={closeModal}
        uploadKey={uploadKey}
      />
    </>
  );
};
