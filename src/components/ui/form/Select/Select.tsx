interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options?: string[]
  labeledOptions?: SelectOption[]
  placeholder?: string
  className?: string
}

export function Select({ value, onChange, options, labeledOptions, placeholder, className = '' }: SelectProps) {
  const baseClass = `w-full px-2.5 py-2 border border-[var(--border)] rounded-md text-[13px] text-[var(--text-h)] bg-[var(--bg)] outline-none cursor-pointer ${className}`

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={baseClass}>
      {placeholder !== undefined && (
        <option value="">{placeholder}</option>
      )}
      {labeledOptions
        ? labeledOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        : options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
    </select>
  )
}
