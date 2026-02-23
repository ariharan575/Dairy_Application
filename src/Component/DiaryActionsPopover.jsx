import { Popover } from "@headlessui/react";
import { MoreVertical } from "lucide-react";

const DiaryActionsPopover = ({
  date,
  onOpen,
  onArchive,
  onRestore,
  onDelete,
  type = "ACTIVE", // ACTIVE or ACHIEVED
}) => {
  return (
    <Popover className="relative">
      <Popover.Button
        onClick={(e) => e.stopPropagation()}
        className="d-flex outline-none focus:outline-none focus:ring-0 active:outline-none"
      >
        <p className="text-gray-500 text-sm fw-semibold">
          {date}
        </p>
        <MoreVertical size={18} />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-50 mt-2 w-32 bg-white rounded shadow border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
        >
          Open
        </button>

        {type === "ACTIVE" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
          >
            Achieve
          </button>
        )}

        {(type === "ACHIEVED" || type === "TRASH") && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            className="block w-full px-3 py-2 text-sm hover:bg-gray-100"
          >
            Restore
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </Popover.Panel>
    </Popover>
  );
};

export default DiaryActionsPopover;