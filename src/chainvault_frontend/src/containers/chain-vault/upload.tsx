import { Button, Input, Text, Card, Progress } from "@tixia/design-system";
import { useFileHandler } from "./hooks/useFileHandler";

export function Upload() {
  const {
    key,
    setKey,
    file,
    uploadProgress,
    handleFileChange,
    handleSubmit,
    handleDownload,
    downloadProgress,
    downloadMutation,
    uploadMutation,
  } = useFileHandler();

  return (
    <Card className="flex flex-col gap-4 bg-white" variant="ghost">
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

        <Card className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Input type="file" variant="ghost" onChange={handleFileChange} />
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="primary"
              disabled={uploadMutation.isPending || !file}
            >
              Save
            </Button>
          </div>

          {uploadMutation.isPending && (
            <Progress
              label="uploading your file"
              showValue
              value={uploadProgress}
            />
          )}
        </Card>
      </Card>

      {/* Download */}
      <Card className="w-fit flex flex-col gap-2" shadow="sm">
        <Text variant="h2">Download</Text>
        <Text variant="p">Enter the key to download a file.</Text>
        <Input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          fullWidth
        />
        <Button
          onClick={(e) => handleDownload(key, e)}
          disabled={downloadMutation.isPending || !key}
        >
          {downloadMutation.isPending ? "Downloading..." : "Download"}
        </Button>

        {downloadMutation.isPending && (
          <Progress
            variant="circular"
            icon="mdi:steam"
            label="downloading your file"
            showValue
            value={downloadProgress}
          />
        )}
      </Card>
    </Card>
  );
}
