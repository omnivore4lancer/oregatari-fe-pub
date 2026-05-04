import { textareaClass } from '../../../../components/ui'

interface VisualFieldProps {
  label: string
  note?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

export function VisualField({ label, note, value, onChange, rows = 3 }: VisualFieldProps) {
  return (
    <div>
      <div className="text-[12px] font-medium text-[var(--text-h)] mb-1">
        {label}
        {note && <span className="font-normal text-[var(--text)] ml-1">{note}</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${textareaClass} min-h-0 resize-none`}
      />
    </div>
  )
}
