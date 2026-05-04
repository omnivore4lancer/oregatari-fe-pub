interface SectionHeaderProps {
  title: string
  icon?: React.ReactNode
  extra?: React.ReactNode
}

export function SectionHeader({ title, icon, extra }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border)]">
      {icon}
      <h2 className="text-[15px] font-bold text-[var(--text-h)] m-0 flex-1">{title}</h2>
      {extra}
    </div>
  )
}
