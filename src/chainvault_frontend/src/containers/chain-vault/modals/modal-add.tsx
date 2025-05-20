import { Dialog, DialogBody, DialogHeader, DialogTitle } from "@tixia/design-system";
import { Upload } from "../upload";

interface IModalUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalUpload = ({ isOpen, onClose }: IModalUploadProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="xl">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Add new file</DialogTitle>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[80vh]">
        <Upload />
      </DialogBody>
    </Dialog>
  );
};
