type BadgeVariant = 'default' | 'success' | 'accent' | 'warning' | 'neutral'

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-500 border border-gray-200',
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  accent: 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]',
  warning: 'bg-amber-50 text-amber-600 border border-amber-200',
  neutral: 'bg-gray-100 text-[var(--text)] border border-[var(--border)]',
}

export function StatusBadge({ label, variant = 'default' }: StatusBadgeProps) {
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${variantClass[variant]}`}>
      {label}
    </span>
  )
}
