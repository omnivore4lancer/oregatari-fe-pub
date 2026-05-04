import {
  OptionalBadge,
  RequiredBadge,
  inputClass,
  textareaClass,
  ToggleButton,
} from '../../../../components/ui'
import type { CharacterDraft } from '../../types'
import { GENDER_OPTIONS } from '../../utils'

interface Props {
  value: CharacterDraft
  onChange: (field: keyof CharacterDraft, value: string) => void
  simplified?: boolean
}

export function ProtagonistFormSection({ value, onChange, simplified = false }: Props) {
  return (
    <div className="mt-0.5">
      <div className="bg-gray-700 text-white font-semibold text-sm px-4 py-2.5">主人公</div>

      {/* 名前 */}
      <div className="bg-[var(--bg)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-4">
        <div className="w-28 shrink-0 flex items-center gap-1">
          <span className="font-semibold text-sm text-[var(--text-h)]">名前</span>
          <OptionalBadge />
        </div>
        <input
          className={inputClass}
          placeholder="主人公の名前"
          value={value.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      {/* 主人公の設定 */}
      <div className="bg-[var(--bg)]">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]">
          <span className="font-semibold text-sm text-[var(--text-h)]">主人公の設定</span>
          <RequiredBadge />
          <span className="text-[11px] text-[var(--text)] ml-auto">詳しく書くほど良い結果</span>
        </div>
        <div className="px-4 py-3.5 flex flex-col gap-3">
          {!simplified && (
            <div className="flex items-center gap-4">
              <div className="w-28 shrink-0 flex items-center gap-1">
                <span className="text-[12px] font-semibold text-[var(--text-h)]">役割</span>
                <OptionalBadge />
              </div>
              <input
                className={inputClass}
                placeholder="例: 勇者、探偵、魔法使い"
                value={value.role}
                onChange={(e) => onChange('role', e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0 flex items-center gap-1">
              <span className="text-[12px] font-semibold text-[var(--text-h)]">性別</span>
              <RequiredBadge />
            </div>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((g) => (
                <ToggleButton
                  key={g}
                  label={g}
                  selected={value.gender === g}
                  onClick={() => onChange('gender', value.gender === g ? '' : g)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0 flex items-center gap-1">
              <span className="text-[12px] font-semibold text-[var(--text-h)]">年齢</span>
              <RequiredBadge />
            </div>
            <div className="flex-1">
              <input
                className={inputClass}
                placeholder="例: 17、不詳、10代前半"
                value={value.age}
                maxLength={20}
                onChange={(e) => onChange('age', e.target.value)}
              />
              <div className="text-[11px] text-[var(--text)] text-right mt-0.5">
                {value.age.length}/20文字
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0 flex items-center gap-1">
              <span className="text-[12px] font-semibold text-[var(--text-h)]">特技・能力</span>
              <RequiredBadge />
            </div>
            <div className="flex-1">
              <input
                className={inputClass}
                placeholder="例: 剣術、魔法、料理"
                value={value.skills}
                maxLength={150}
                onChange={(e) => onChange('skills', e.target.value)}
              />
              <div className="text-[11px] text-[var(--text)] text-right mt-0.5">
                {value.skills.length}/150文字
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-28 shrink-0 pt-2 flex flex-wrap items-center gap-1">
              <span className="text-[12px] font-semibold text-[var(--text-h)]">
                どんなキャラクター
              </span>
              <RequiredBadge />
              <span
                className="text-sm text-[var(--text)] cursor-default leading-none"
                title="キャラクターの意志や動機を書くと物語の質が上がります"
              >
                ⓘ
              </span>
            </div>
            <div className="flex-1">
              <textarea
                className={textareaClass}
                placeholder="意志力のもとになる要素"
                value={value.overview}
                maxLength={300}
                onChange={(e) => onChange('overview', e.target.value)}
              />
              <div className="text-[11px] text-[var(--text)] text-right mt-0.5">
                {value.overview.length}/300文字
              </div>
            </div>
          </div>

          {!simplified && (
            <>
              <TextareaField
                label="外見"
                value={value.appearance}
                placeholder="外見・容姿の説明"
                onChange={(v) => onChange('appearance', v)}
              />
              <TextareaField
                label="性格"
                value={value.personality}
                placeholder="性格・特徴"
                onChange={(v) => onChange('personality', v)}
              />
              <TextareaField
                label="動機"
                value={value.motivation}
                placeholder="目的・動機"
                onChange={(v) => onChange('motivation', v)}
              />
              <TextareaField
                label="経歴"
                value={value.background}
                placeholder="過去の経歴・背景"
                onChange={(v) => onChange('background', v)}
              />
            </>
          )}
        </div>
      </div>
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
