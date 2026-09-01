import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: "primary" | "danger";
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "হ্যাঁ, নিশ্চিত করুন",
  cancelLabel = "বাতিল",
  onConfirm,
  onCancel,
  loading,
  variant = "primary",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl border border-[#DCE6E0] shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-[#17221D] text-lg mb-2">{title}</h3>
        <p className="text-sm text-[#66736D] mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            loading={loading}
            variant={variant}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
