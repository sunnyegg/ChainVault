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
    uploadDate?: string;
    expired?: boolean;
    remainingTime?: string;
  }
) => {
  const {
    name,
    type,
    size,
    setSelectedItem,
    openModal,
    uploadDate,
    expired,
    remainingTime,
  } = props;
  const icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS];
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 hover:bg-primary-50 cursor-pointer h-fit justify-between border-b border-gray-200 p-2 md:p-3 transition-all duration-200"
      onClick={() => {
        setSelectedItem(props);
        openModal("action");
      }}
    >
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Icon
          icon={icon}
          className="rounded-md bg-primary-50 flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
        />
        <div className="flex flex-col gap-1 md:gap-2 items-start min-w-0 flex-1">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <Text
              className="truncate text-primary text-sm md:text-base"
              variant="subtitle1"
            >
              {name}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 md:gap-2 items-start sm:items-end w-full sm:w-auto">
        <Text variant="caption" className="text-xs md:text-sm">
          Uploaded at: {uploadDate || "20/05/2025"}
        </Text>
        <Text variant="caption" className="text-xs md:text-sm">
          Size: {size}
        </Text>
        {remainingTime && (
          <Text
            variant="caption"
            className={`text-xs md:text-sm font-medium ${
              expired ? "text-red-500" : "text-amber-600"
            }`}
          >
            {expired ? "Expired" : `Expires in: ${remainingTime}`}
          </Text>
        )}
      </div>
    </div>
  );
};
