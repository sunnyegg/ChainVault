import { useState } from "react";
import {
  Card,
  Input,
  Icon,
  Text,
  Button,
  SelectItem,
  Select,
} from "@tixia/design-system";
import { DUMMY_FILES, TYPE_ICONS } from "../../constants";
import { ModalUpload } from "./modals/modal-add";
import { ModalActions } from "./modals/modal-action";

interface IFileProps {
  name: string;
  type: string;
  size: string;
}

export const Files = () => {
  const [modalOpen, setModalOpen] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState("grid");
  return (
    <>
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
          <Button
            variant="primary"
            rounded="full"
            leftIcon="mdi:add"
            onClick={() => setModalOpen("add")}
          >
            Add new file
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={
              view === "list"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }
            variant="outline-primary"
            rounded="full"
            leftIcon="mdi:format-align-justify"
            onClick={() => setView("list")}
          ></Button>
          <Button
            className={
              view === "grid"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }
            variant="outline-primary"
            rounded="full"
            leftIcon="mdi:grid-large"
            onClick={() => setView("grid")}
          ></Button>
        </div>
      </div>
      {view === "list" ? (
        <Card className="grid gap-2 bg-white">
          {!!DUMMY_FILES.length ? (
            DUMMY_FILES.map((file) => (
              <List
                key={file.name}
                {...file}
                setSelectedItem={setSelectedItem}
                setModalOpen={setModalOpen}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              No files found
            </div>
          )}
        </Card>
      ) : (
        <Card className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 bg-white">
          {!!DUMMY_FILES.length ? (
            DUMMY_FILES.map((file) => (
              <ListBox
                key={file.name}
                {...file}
                setSelectedItem={setSelectedItem}
                setModalOpen={setModalOpen}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              No files found
            </div>
          )}
        </Card>
      )}
      <Text variant="caption" className="text-center">
        Powered by <span className="font-bold text-primary">ChainVault</span>
      </Text>
      <ModalActions
        isOpen={modalOpen === "action"}
        onClose={() => setModalOpen("")}
        item={selectedItem}
      />
      <ModalUpload
        isOpen={modalOpen === "add"}
        onClose={() => setModalOpen("")}
      />
    </>
  );
};

const List = (
  props: IFileProps & {
    setSelectedItem: (item: any) => void;
    setModalOpen: (open: string) => void;
  }
) => {
  const { name, type, size, setSelectedItem, setModalOpen } = props;
  const icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
  return (
    <div
      className="flex items-center gap-3 hover:bg-primary-50 cursor-pointer h-fit justify-between border-b border-gray-200 p-2"
      onClick={() => {
        setSelectedItem(props);
        setModalOpen("action");
      }}
    >
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="rounded-md bg-primary-50" />
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-col gap-1">
            <Text className="truncate text-primary" variant="subtitle1">
              {name}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <Text variant="caption">Uploaded at: 20/05/2025</Text>
        <Text variant="caption">Size: {size}</Text>
      </div>
    </div>
  );
};

const ListBox = (
  props: IFileProps & {
    setSelectedItem: (item: any) => void;
    setModalOpen: (open: string) => void;
  }
) => {
  const { name, type, size, setSelectedItem, setModalOpen } = props;
  const icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
  return (
    <Card
      className="flex items-start gap-3 hover:bg-primary-50 cursor-pointer h-fit"
      onClick={() => {
        setSelectedItem(props);
        setModalOpen("action");
      }}
    >
      <Icon icon={icon} size="50" className="rounded-md p-2 bg-primary-50" />
      <div className="flex flex-col gap-2 items-start">
        <div className="flex flex-col gap-1">
          <Text className="truncate text-primary" variant="subtitle1">
            {name}
          </Text>
          <Text variant="caption">Size: {size}</Text>
        </div>
      </div>
    </Card>
  );
};
