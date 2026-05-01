import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm">
      <div className="px-6 py-5">
        <p className="text-dark/75 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className={isDangerous ? "!bg-error hover:!bg-error/90" : ""}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
