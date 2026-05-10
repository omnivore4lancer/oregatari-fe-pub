export function RequiredBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-red-500 text-white text-[9px] font-medium px-1.5 leading-4 tracking-wider">
      必須
    </span>
  )
}

export function OptionalBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] text-[var(--text)] text-[9px] font-medium px-1.5 leading-4 tracking-wider">
      任意
    </span>
  )
}
