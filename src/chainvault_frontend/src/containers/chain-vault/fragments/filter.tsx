import { SelectItem, Select, Input, Button } from "@tixia/design-system";
import { UseMutationResult } from "@tanstack/react-query";

interface IFilterProps {
  openModal: (modal: string) => void;
  view: string;
  setView: (view: string) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadMutation: UseMutationResult<any, Error, any>;
  handleSubmit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const Filter = ({
  openModal,
  view,
  setView,
  handleFileChange,
  uploadMutation,
  handleSubmit,
  fileInputRef,
}: IFilterProps) => {
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Input
          leftIcon="mdi:search"
          type="search"
          placeholder="Search file"
          rounded="full"
        />
        <Select
          rounded="full"
          fullWidth={false}
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
          fullWidth={false}
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
          leftIcon="mdi:add"
          isLoading={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          Add new file
        </Button>
        <Button
          variant="primary"
          rounded="full"
          leftIcon="mdi:download"
          onClick={() => openModal("action")}
        >
          Download File
        </Button>
      </div>
      <div className="flex items-center gap-2">
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
