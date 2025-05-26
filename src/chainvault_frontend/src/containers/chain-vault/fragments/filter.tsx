import { SelectItem, Select, Input, Button } from "@tixia/design-system";
import { UseMutationResult } from "@tanstack/react-query";

interface IFilterProps {
  openModal: (modal: string) => void;
  view: string;
  setView: (view: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadMutation: UseMutationResult<any, Error, any>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  uploadProgress: number;
}

export const Filter = ({
  openModal,
  view,
  setView,
  handleFileChange,
  uploadMutation,
  fileInputRef,
  uploadProgress,
}: IFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-row gap-2 w-full">
        <Input
          leftIcon="mdi:search"
          type="search"
          placeholder="Search file"
          rounded="full"
          fullWidth
          className="md:col-span-2"
        />
        <Select
          rounded="full"
          fullWidth
          value=""
          placeholder="File Type"
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="doc">DOC</SelectItem>
          <SelectItem value="docx">DOCX</SelectItem>
          <SelectItem value="xls">XLS</SelectItem>
          <SelectItem value="xlsx">XLSX</SelectItem>
          <SelectItem value="ppt">PPT</SelectItem>
          <SelectItem value="pptx">PPTX</SelectItem>
          <SelectItem value="zip">ZIP</SelectItem>
          <SelectItem value="rar">RAR</SelectItem>
        </Select>
        <Select
          rounded="full"
          fullWidth
          value=""
          placeholder="File Size"
        >
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </Select>
        <Input
          type="file"
          variant="ghost"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          variant="primary"
          rounded="full"
          fullWidth
          leftIcon="mdi:add"
          isLoading={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
          className="truncate"
        >
          {uploadMutation.isPending ? "Uploading... " + uploadProgress + "%" : "Add New File"}
        </Button>
        <Button
          variant="primary"
          rounded="full"
          fullWidth
          leftIcon="mdi:download"
          onClick={() => openModal("action")}
          className="truncate"
        >
          Download File
        </Button>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <Button
          className={
            view === "list" ? "bg-primary text-white" : "bg-white text-primary"
          }
          variant="outline-primary"
          rounded="full"
          leftIcon="mdi:format-align-justify"
          onClick={() => setView("list")}
        />
        <Button
          className={
            view === "grid" ? "bg-primary text-white" : "bg-white text-primary"
          }
          variant="outline-primary"
          rounded="full"
          leftIcon="mdi:grid-large"
          onClick={() => setView("grid")}
        />
      </div>
    </div>
  );
};
