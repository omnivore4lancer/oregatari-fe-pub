interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <div className="text-[13px] font-medium text-[var(--text-h)] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </div>
      {children}
    </div>
  )
}
