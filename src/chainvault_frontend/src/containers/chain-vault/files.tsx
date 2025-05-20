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
  return (
    <>
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
          placeholder="File type"
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="doc">DOC</SelectItem>
          <SelectItem value="docx">DOCX</SelectItem>
          <SelectItem value="xls">XLS</SelectItem>
          <SelectItem value="xlsx">XLSX</SelectItem>
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
        <Button variant="outline-primary" rounded="full" leftIcon="mdi:filter">
          Filter
        </Button>
        <Button
          variant="primary"
          rounded="full"
          leftIcon="mdi:add"
          onClick={() => setModalOpen("add")}
        >
          Add new file
        </Button>
      </div>
      <Card className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 bg-white">
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
    <Card
      className="flex items-start gap-3 hover:bg-gray-100 cursor-pointer h-fit"
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


