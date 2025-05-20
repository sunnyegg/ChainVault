import { Card, Text, Icon } from "@tixia/design-system";
import { TYPE_ICONS } from "../../../constants";

interface IFileProps {
  name: string;
  type: string;
  size: string;
}

export const ListGrid = (
  props: IFileProps & {
    setSelectedItem: (item: any) => void;
    openModal: (open: string) => void;
  }
) => {
  const { name, type, size, setSelectedItem, openModal } = props;
  const icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
  return (
    <Card
      className="flex items-start gap-3 hover:bg-primary-50 cursor-pointer h-fit"
      onClick={() => {
        setSelectedItem(props);
        openModal("action");
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
