import { TYPE_ICONS } from "../../../constants";
import { Text, Icon } from "@tixia/design-system";

interface IFileProps {
  name: string;
  type: string;
  size: string;
}

export const List = (
  props: IFileProps & {
    setSelectedItem: (item: any) => void;
    openModal: (open: string) => void;
  }
) => {
  const { name, type, size, setSelectedItem, openModal } = props;
  const icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
  return (
    <div
      className="flex items-center gap-3 hover:bg-primary-50 cursor-pointer h-fit justify-between border-b border-gray-200 p-2"
      onClick={() => {
        setSelectedItem(props);
        openModal("action");
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
