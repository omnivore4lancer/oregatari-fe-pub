interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '削除',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[var(--text-h)] mb-2">{title}</h2>
        <p className="text-[13px] text-[var(--text)] leading-relaxed mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-colors cursor-pointer ${confirmVariant === 'primary' ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-violet-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
