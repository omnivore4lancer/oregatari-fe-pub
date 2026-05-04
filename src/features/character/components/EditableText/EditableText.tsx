import { useState } from 'react'

import { EditIcon } from '../../../../components/Icons'
import { Button, inputClass, textareaClass } from '../../../../components/ui'

function FieldActions({
  onSave,
  onCancel,
  saving,
  disabled,
}: {
  onSave: () => void
  onCancel: () => void
  saving: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex gap-2 mt-2.5">
      <Button variant="primary" className="text-[12px]" onClick={onSave} disabled={saving || disabled}>
        {saving ? '保存中...' : '保存'}
      </Button>
      <Button className="text-[12px]" onClick={onCancel}>
        キャンセル
      </Button>
    </div>
  )
}

interface EditableTextProps {
  label: string
  value: string
  multiline?: boolean
  placeholder?: string
  required?: boolean
  onSave: (value: string) => Promise<void>
}

export function EditableText({ label, value, multiline, placeholder, required, onSave }: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }

  async function save() {
    if (required && !draft.trim()) return
    setSaving(true)
    try {
      await onSave(draft.trim())
      setEditing(false)
    } catch {
      /* parent shows error */
    } finally {
      setSaving(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!multiline && e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border border-purple-300 shadow-sm px-4 py-3">
        <p className="text-[11px] font-semibold text-purple-500 mb-1.5">{label}</p>
        {multiline ? (
          <textarea
            className={`${textareaClass} min-h-[80px] w-full`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <input
            className={`${inputClass} w-full`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <FieldActions
          onSave={save}
          onCancel={() => setEditing(false)}
          saving={saving}
          disabled={!!required && !draft.trim()}
        />
      </div>
    )
  }

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer px-4 py-3"
      onClick={startEdit}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-gray-400 mb-1">{label}</p>
        <span className="shrink-0 text-gray-300 group-hover:text-purple-400 transition-colors mt-0.5">
          <EditIcon size={11} />
        </span>
      </div>
      <p className="text-[13px] text-[var(--text-h)] leading-relaxed m-0 whitespace-pre-wrap">
        {value || <span className="text-gray-300">未設定</span>}
      </p>
    </div>
  )
}
