interface EpisodeTypeCardProps {
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function EpisodeTypeCard({
  icon,
  title,
  description,
  selected,
  onSelect,
}: EpisodeTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex-1 p-5 rounded-xl border-2 bg-white text-left cursor-pointer transition-all ${
        selected
          ? 'border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-bg)]'
          : 'border-[var(--border)] hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="mb-3">{icon}</div>
      <div className="font-semibold text-[15px] text-[var(--text-h)] mb-1.5">{title}</div>
      <div className="text-[12px] text-[var(--text)] leading-relaxed">{description}</div>
    </button>
  )
}
