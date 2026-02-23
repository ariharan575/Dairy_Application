import { Dialog } from "@headlessui/react";

const ConfirmDialog = ({
  open,
  setOpen,
  title,
  message,
  confirmText = "Confirm",
  onConfirm,
  confirmColor = "bg-red-500",
}) => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-lg w-80">
          <Dialog.Title className="font-semibold text-lg">
            {title}
          </Dialog.Title>

          <p className="text-sm text-gray-500 mt-2">
            {message}
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button
              onClick={onConfirm}
              className={`${confirmColor} text-white px-4 py-1 rounded`}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;