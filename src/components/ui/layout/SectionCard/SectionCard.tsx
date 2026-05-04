interface SectionCardProps {
  title: string
  headerActions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, headerActions, children, className }: SectionCardProps) {
  return (
    <div className={`bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
        <span className="font-bold text-sm text-[var(--text-h)]">{title}</span>
        {headerActions && <div className="flex items-center gap-1.5">{headerActions}</div>}
      </div>
      <div className="px-4 py-3.5">{children}</div>
    </div>
  )
}
