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
      className="flex items-start gap-2 md:gap-3 hover:bg-primary-50 cursor-pointer h-fit p-2 md:p-3 transition-all duration-200"
      onClick={() => {
        setSelectedItem(props);
        openModal("action");
      }}
    >
      <Icon 
        icon={icon} 
        size="40" 
        className="rounded-md p-1.5 md:p-2 bg-primary-50 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center" 
      />
      <div className="flex flex-col gap-1 md:gap-2 items-start min-w-0 flex-1">
        <div className="flex flex-col gap-0.5 md:gap-1 w-full">
          <Text className="truncate text-primary text-sm md:text-base" variant="subtitle1">
            {name}
          </Text>
          <Text variant="caption" className="text-xs md:text-sm">Size: {size}</Text>
        </div>
      </div>
    </Card>
  );
};
