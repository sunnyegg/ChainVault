import { UseMutationResult } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Input,
  Text,
  useToast,
} from "@tixia/design-system";
import { useState, useEffect } from "react";

interface IModalDownloadProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  handleDownload: (key: string, e: React.FormEvent) => void;
  downloadMutation: UseMutationResult<any, Error, any>;
  downloadProgress: number;
}

export const ModalDownload = ({
  isOpen,
  onClose,
  item,
  handleDownload,
  downloadMutation,
  downloadProgress,
}: IModalDownloadProps) => {
  const [key, setKey] = useState("");
  const { showToast } = useToast();

  // Use stored key if available
  useEffect(() => {
    if (item?.key_) {
      setKey(item.key_);
    }

    // Automatically delete and close modal if file is expired
    if (isOpen && item?.expired === true && item?.fileId) {
      // Dispatch event to delete file
      const customEvent = new CustomEvent("delete-file", {
        detail: { fileId: item.fileId },
      });
      document.dispatchEvent(customEvent);

      // Close modal
      onClose();

      // Show toast
      showToast({
        title: "File Removed",
        description: "Expired file has been deleted from your vault",
        variant: "info",
      });
    }
  }, [item, isOpen]);

  // Check if file is expired
  const isExpired = item?.expired === true;

  const handleClose = () => {
    setKey("");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} size="xl">
      <DialogHeader onClose={handleClose}>
        <DialogTitle>{item?.name || "File"}</DialogTitle>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[80vh]">
        {isExpired && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Text variant="subtitle2" className="text-red-600 font-medium">
              Warning: This file has expired
            </Text>
            <Text variant="body2" className="text-red-500">
              Files are only available for 60 seconds after upload. This file is
              no longer accessible on the server.
            </Text>
          </div>
        )}
        <Text variant="subtitle1">
          Please enter your key to download the file.
        </Text>
        <div className="flex gap-2 items-center">
          <Input
            helperText="Enter your key to download or delete the file"
            error={!key}
            errorText="Key is required to download or delete the file"
            placeholder="Key"
            rounded="md"
            className="mt-2"
            fullWidth
            onChange={(e) => setKey(e.target.value)}
            value={key}
          />
          <Button
            variant="ghost"
            title="Paste from clipboard"
            className="h-fit"
            leftIcon="mingcute:paste-fill"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                setKey(text);
              } catch (err) {
                showToast({
                  title: "Error",
                  description: "Failed to read from clipboard",
                  variant: "error",
                });
              }
            }}
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button
          disabled={!key || downloadMutation.isPending || isExpired}
          variant="primary"
          className="w-full"
          leftIcon="mdi:download"
          isLoading={downloadMutation.isPending}
          onClick={(e) => handleDownload(key, e)}
          title={
            isExpired ? "This file has expired and cannot be downloaded" : ""
          }
        >
          {downloadMutation.isPending
            ? downloadProgress + "%"
            : isExpired
            ? "File Expired"
            : "Download"}
        </Button>
        <Button
          disabled={!key}
          variant="outline-danger"
          className="w-full"
          leftIcon="mdi:delete"
          onClick={() => {
            if (item?.fileId) {
              // We need to pass this to parent component to handle deletion
              const customEvent = new CustomEvent("delete-file", {
                detail: { fileId: item.fileId },
              });
              document.dispatchEvent(customEvent);
              handleClose();

              // Show deleted toast (parent will handle actual deletion)
              showToast({
                title: "File Deleted",
                description: "File has been removed from your vault",
                variant: "info",
              });
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
