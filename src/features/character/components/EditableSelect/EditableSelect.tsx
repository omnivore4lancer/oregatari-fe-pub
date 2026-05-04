import { useState } from 'react'

import { EditIcon } from '../../../../components/Icons'
import { Button, Select } from '../../../../components/ui'
import { ARCHETYPE_ROLE_LABELS } from '../../types'
import type { ArchetypeRole } from '../../types'

function FieldActions({
  onSave,
  onCancel,
  saving,
}: {
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  return (
    <div className="flex gap-2 mt-2.5">
      <Button variant="primary" className="text-[12px]" onClick={onSave} disabled={saving}>
        {saving ? '保存中...' : '保存'}
      </Button>
      <Button className="text-[12px]" onClick={onCancel}>
        キャンセル
      </Button>
    </div>
  )
}

interface EditableSelectProps {
  label: string
  value: ArchetypeRole | null | undefined
  onSave: (value: ArchetypeRole | '') => Promise<void>
}

export function EditableSelect({ label, value, onSave }: EditableSelectProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ArchetypeRole | ''>('')
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setDraft((value ?? '') as ArchetypeRole | '')
    setEditing(true)
  }

  async function save() {
    setSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } catch {
      /* parent shows error */
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border border-purple-300 shadow-sm px-4 py-3">
        <p className="text-[11px] font-semibold text-purple-500 mb-1.5">{label}</p>
        <Select
          value={draft}
          onChange={(v) => setDraft(v as ArchetypeRole | '')}
          placeholder="未設定（任意）"
          labeledOptions={Object.entries(ARCHETYPE_ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />
        <FieldActions onSave={save} onCancel={() => setEditing(false)} saving={saving} />
      </div>
    )
  }

  const display = value ? ARCHETYPE_ROLE_LABELS[value] : null
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
      <p className="text-[13px] text-[var(--text-h)] m-0">
        {display || <span className="text-gray-300">未設定</span>}
      </p>
    </div>
  )
}
