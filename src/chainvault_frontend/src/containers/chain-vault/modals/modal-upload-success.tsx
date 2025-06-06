import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Text,
  Notification,
  useToast,
} from "@tixia/design-system";

interface IModalUploadSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  uploadKey: string;
}

export const ModalUploadSuccess = ({
  isOpen,
  onClose,
  uploadKey,
}: IModalUploadSuccessProps) => {
  const { showToast } = useToast();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="xl">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Congratulations!</DialogTitle>
      </DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[80vh]">
        <Text variant="subtitle2" className="mt-2">
          You have successfully uploaded your file!
        </Text>
        <Notification
          icon="mingcute:information-fill"
          title="Information"
          variant="info"
          className="my-3"
        >
          <li>
            Your file information has been saved to your local storage and will
            be visible in your files list. You can access it at any time from
            this device.
          </li>
        </Notification>
        <Notification
          icon="mingcute:warning-fill"
          title="Warning"
          variant="warning"
          className="my-3"
        >
          <li>
            For Demo Purposes, your files will only last for 1 minute to
            demonstrate file expiration.
          </li>
        </Notification>
        <Notification
          icon="mingcute:warning-fill"
          title="Warning"
          variant="warning"
          className="my-3"
        >
          <li className="font-bold">Do not lose or forget your key.</li>
          <li>
            If you lose or forget your key, you will not be able to download
            your file.
          </li>
          <li className="font-bold"> Do not share your key with anyone.</li>
          <li>
            If you share your key with anyone, they will be able to download
            your file.
          </li>
        </Notification>
        <Text variant="subtitle2" className="text-neutral-500">
          Please save the following key to be able to download your file later.
        </Text>
        <div className="flex gap-2 mb-2">
          <Text variant="subtitle2" className="text-primary-500">
            Here is your key:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {uploadKey}
            </span>
          </Text>
          <Button
            onClick={() => {
              if (uploadKey) {
                navigator.clipboard.writeText(uploadKey);
                showToast({
                  title: "Success",
                  variant: "success",
                  description: "Key copied to clipboard!",
                });
              }
            }}
            variant="outline-primary"
            size="xs"
          >
            Copy
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};
