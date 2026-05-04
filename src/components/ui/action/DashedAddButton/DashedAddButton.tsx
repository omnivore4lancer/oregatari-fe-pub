import { PlusIcon } from '../../../Icons'

interface DashedAddButtonProps {
  label: string
  onClick?: () => void
}

export function DashedAddButton({ label, onClick }: DashedAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 w-full py-2.5 border-2 border-dashed border-[var(--border)] rounded-lg bg-transparent text-[13px] text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors cursor-pointer"
    >
      <PlusIcon size={12} />
      {label}
    </button>
  )
}
