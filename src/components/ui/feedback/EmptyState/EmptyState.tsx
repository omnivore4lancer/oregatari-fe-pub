interface EmptyStateProps {
  icon?: React.ReactNode
  message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-2 text-[var(--text)] text-[13px]">
      {icon}
      <span>{message}</span>
    </div>
  )
}
