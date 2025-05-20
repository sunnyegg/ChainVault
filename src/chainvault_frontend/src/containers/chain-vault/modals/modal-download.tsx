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
import { useState } from "react";

interface IModalDownloadProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  handleDownload: (key: string, e: React.FormEvent) => void;
  downloadMutation: UseMutationResult<any, Error, any>;
}

export const ModalDownload = ({
  isOpen,
  onClose,
  item,
  handleDownload,
  downloadMutation,
}: IModalDownloadProps) => {
  const [key, setKey] = useState("");
  const { showToast } = useToast();

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
          disabled={!key}
          variant="primary"
          className="w-full"
          leftIcon="mdi:download"
          isLoading={downloadMutation.isPending}
          onClick={(e) => handleDownload(key, e)}
        >
          Download
        </Button>
        <Button
          disabled={!key}
          variant="outline-danger"
          className="w-full"
          leftIcon="mdi:delete"
          // isLoading={downloadMutation.isPending}
          // onClick={(e) => handleDownload(key, e)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
