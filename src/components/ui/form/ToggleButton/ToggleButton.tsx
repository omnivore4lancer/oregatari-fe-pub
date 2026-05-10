interface ToggleButtonProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function ToggleButton({ label, selected, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-1.5 px-2.5 rounded-md text-[13px] cursor-pointer transition-all duration-150 text-center ${
        selected
          ? 'border-[1.5px] border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)] font-semibold'
          : 'border border-black bg-[var(--bg)] text-[var(--text-h)]'
      }`}
    >
      {label}
    </button>
  )
}
