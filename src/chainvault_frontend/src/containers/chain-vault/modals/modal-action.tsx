import { Button, Dialog,DialogActions, DialogTitle, Input } from "@tixia/design-system";
import { useState } from "react";

interface IModalActionsProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const ModalActions = ({ isOpen, onClose, item }: IModalActionsProps) => {
  const [key, setKey] = useState("");
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogTitle>{item?.name}</DialogTitle>
      <Input
        helperText="Enter your key to download or delete the file"
        error={!key}
        errorText="Key is required to download or delete the file"
        placeholder="Key"
        rounded="md"
        fullWidth
        className="mt-2"
        onChange={(e) => setKey(e.target.value)}
        value={key}
      />
      <DialogActions>
        <Button
          disabled={!key}
          variant="primary"
          className="w-full"
          leftIcon="mdi:download"
        >
          Download
        </Button>
        <Button
          disabled={!key}
          variant="primary"
          className="w-full"
          leftIcon="mdi:delete"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};