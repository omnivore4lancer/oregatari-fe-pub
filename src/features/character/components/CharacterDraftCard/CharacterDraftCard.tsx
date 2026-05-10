import { useState } from 'react'
import { ChevronDownIcon, TrashIcon } from '../../../../components/Icons'
import { OptionalBadge, inputClass, textareaClass, ToggleButton } from '../../../../components/ui'
import type { CharacterDraft } from '../../types'
import { GENDER_OPTIONS } from '../../utils'

interface Props {
  index: number
  char: CharacterDraft
  onChange: (field: keyof CharacterDraft, value: string) => void
  onRemove: () => void
  simplified?: boolean
  defaultOpen?: boolean
}

export function CharacterDraftCard({ index, char, onChange, onRemove, simplified = false, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--border)]">
      <div className="bg-[var(--bg)] flex items-center px-4 py-3 border-b border-[var(--border)] hover:bg-gray-50 transition-colors">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 flex-1 text-left bg-transparent border-none cursor-pointer"
        >
          <span
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', display: 'inline-flex' }}
            className="text-gray-400"
          >
            <ChevronDownIcon size={15} />
          </span>
          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[11px] font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="text-[13px] font-semibold text-[var(--text-h)]">登場人物 {index + 1}</span>
          {!open && char.name && (
            <span className="text-[12px] text-[var(--text)] ml-1 truncate">— {char.name}</span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 transition-colors shrink-0 px-2 py-1 rounded hover:bg-red-50"
        >
          <TrashIcon size={12} />
          削除
        </button>
      </div>
      {open && <div className="bg-[var(--bg)] px-4 py-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Label text="名前" />
          <input
            className={inputClass}
            placeholder="登場人物の名前"
            value={char.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label text="主人公との関係" />
          <input
            className={inputClass}
            placeholder="例: 師匠、ライバル、ヒロイン"
            value={char.role}
            onChange={(e) => onChange('role', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label text="年齢" />
          <input
            className={inputClass}
            placeholder="例: 35、中年"
            value={char.age}
            maxLength={20}
            onChange={(e) => onChange('age', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label text="性別" />
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((g) => (
              <ToggleButton
                key={g}
                label={g}
                selected={char.gender === g}
                onClick={() => onChange('gender', char.gender === g ? '' : g)}
              />
            ))}
          </div>
        </div>

        {!simplified && (
          <div className="flex items-center gap-4">
            <Label text="特技・能力" />
            <input
              className={inputClass}
              placeholder="例: 剣術、策略"
              value={char.skills}
              maxLength={150}
              onChange={(e) => onChange('skills', e.target.value)}
            />
          </div>
        )}

        <TextareaField label="性格" value={char.personality} placeholder="性格・特徴" onChange={(v) => onChange('personality', v)} />
        <TextareaField label="説明" value={char.overview} placeholder="キャラクターの説明" onChange={(v) => onChange('overview', v)} />

        {!simplified && (
          <>
            <TextareaField label="外見" value={char.appearance} placeholder="外見・容姿の説明" onChange={(v) => onChange('appearance', v)} />
            <TextareaField label="動機" value={char.motivation} placeholder="目的・動機" onChange={(v) => onChange('motivation', v)} />
            <TextareaField label="経歴" value={char.background} placeholder="過去の経歴・背景" onChange={(v) => onChange('background', v)} />
          </>
        )}
      </div>}
    </div>
  )
}

function Label({ text }: { text: string }) {
  return (
    <div className="w-28 shrink-0 flex items-center gap-1">
      <span className="text-[12px] font-semibold text-[var(--text-h)]">{text}</span>
      <OptionalBadge />
    </div>
  )
}

function TextareaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-28 shrink-0 pt-2 flex items-center gap-1">
        <span className="text-[12px] font-semibold text-[var(--text-h)]">{label}</span>
        <OptionalBadge />
      </div>
      <div className="flex-1">
        <textarea
          className={textareaClass}
          placeholder={placeholder}
          value={value}
          maxLength={300}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-[11px] text-[var(--text)] text-right mt-0.5">{value.length}/300文字</div>
      </div>
    </div>
  )
}
