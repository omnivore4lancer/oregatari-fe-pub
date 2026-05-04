import { useState } from 'react'

import { EditIcon } from '../../../../components/Icons'
import { Button, DashedAddButton, inputClass } from '../../../../components/ui'

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

interface EditableSkillsProps {
  skills: string[]
  onSave: (skills: string[]) => Promise<void>
}

export function EditableSkills({ skills, onSave }: EditableSkillsProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setDraft([...skills])
    setEditing(true)
  }

  async function save() {
    setSaving(true)
    try {
      await onSave(draft.filter((s) => s.trim()))
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
        <p className="text-[11px] font-semibold text-purple-500 mb-2">スキル・能力</p>
        <div className="flex flex-col gap-2">
          {draft.map((skill, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                className={`${inputClass} flex-1`}
                placeholder="例: 剣術、魔法、料理"
                value={skill}
                onChange={(e) =>
                  setDraft((prev) => prev.map((s, i) => (i === idx ? e.target.value : s)))
                }
              />
              <button
                type="button"
                onClick={() => setDraft((prev) => prev.filter((_, i) => i !== idx))}
                className="px-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
              >
                ✕
              </button>
            </div>
          ))}
          <DashedAddButton label="スキルを追加" onClick={() => setDraft((prev) => [...prev, ''])} />
        </div>
        <FieldActions onSave={save} onCancel={() => setEditing(false)} saving={saving} />
      </div>
    )
  }

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer px-4 py-3"
      onClick={startEdit}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-gray-400 mb-2">スキル・能力</p>
        <span className="shrink-0 text-gray-300 group-hover:text-purple-400 transition-colors mt-0.5">
          <EditIcon size={11} />
        </span>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-[12px] text-[var(--text-h)] bg-gray-50 border border-gray-200 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-gray-300 m-0">未設定</p>
      )}
    </div>
  )
}
