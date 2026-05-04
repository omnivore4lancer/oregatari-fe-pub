import { Field, inputClass, SectionCard, Select, textareaClass } from '../../../../components/ui'
import { ART_STYLES, ASPECT_RATIOS } from '../../constants'
import type { MaterialBasicForm } from '../../types'
import type { GroupItem } from '../GroupPanel/GroupPanel'

interface BasicInfoSectionProps {
  values: MaterialBasicForm
  onChange: (updates: Partial<MaterialBasicForm>) => void
  groups?: GroupItem[]
}

export function BasicInfoSection({ values, onChange, groups = [] }: BasicInfoSectionProps) {
  return (
    <SectionCard
      title="基本情報"
      headerActions={
        <span className="text-[11px] text-[var(--text)] flex items-center gap-1">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          image type 固定
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field label="素材名" required>
              <input
                type="text"
                value={values.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="例: 王都の夜市背景"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="グループ">
            <Select
              value={values.groupId}
              onChange={(v) => onChange({ groupId: v })}
              options={groups.map((g) => g.label)}
            />
          </Field>
        </div>

        <Field label="説明文">
          <textarea
            value={values.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="未入力の場合、ロケーション情報から自動生成されます"
            rows={2}
            className={`${textareaClass} min-h-0 resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="アスペクト比">
            <Select
              value={values.aspectRatio}
              onChange={(v) => onChange({ aspectRatio: v })}
              options={ASPECT_RATIOS}
            />
          </Field>
          <Field label="画風・スタイル">
            <Select
              value={values.artStyle}
              onChange={(v) => onChange({ artStyle: v })}
              options={ART_STYLES}
            />
            <p className="text-[11px] text-[var(--text)] mt-1">
              選択したスタイルの表現技法を適用します。
            </p>
          </Field>
        </div>
      </div>
    </SectionCard>
  )
}
