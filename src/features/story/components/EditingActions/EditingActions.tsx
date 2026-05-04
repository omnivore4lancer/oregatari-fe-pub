import { EditIcon } from '../../../../components/Icons'

interface EditingActionsProps {
  editing: boolean
  onEdit: () => void
  onDone: () => void
  onCancel: () => void
  submitting?: boolean
  extra?: React.ReactNode
}

export function EditingActions({ editing, onEdit, onDone, onCancel, submitting, extra }: EditingActionsProps) {
  if (editing) {
    return (
      <>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="text-[12px] border border-[var(--border)] px-2 py-1 rounded cursor-pointer bg-transparent text-[var(--text)] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={submitting}
          className="text-[12px] border border-[var(--accent-border)] text-[var(--accent)] bg-[var(--accent-bg)] px-2 py-1 rounded cursor-pointer hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? '保存中...' : '完了'}
        </button>
      </>
    )
  }
  return (
    <>
      {extra}
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1 text-[12px] border border-[var(--border)] text-[var(--text)] px-2 py-1 rounded cursor-pointer bg-transparent hover:bg-[var(--accent-bg)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors"
      >
        <EditIcon size={11} />
        編集
      </button>
    </>
  )
}
