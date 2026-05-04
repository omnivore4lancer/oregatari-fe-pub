import { Field, inputClass, SectionCard, Select, textareaClass } from '../../../../components/ui'
import { TIME_SLOTS, WEATHER_OPTIONS } from '../../constants'
import type { MaterialSceneForm } from '../../types'

interface SceneDescSectionProps {
  values: MaterialSceneForm
  onChange: (updates: Partial<MaterialSceneForm>) => void
}

export function SceneDescSection({ values, onChange }: SceneDescSectionProps) {
  return (
    <SectionCard title="シーンの説明">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <Field label="ロケーション（メイン）" required>
            <input
              type="text"
              value={values.locationMain}
              onChange={(e) => onChange({ locationMain: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="ロケーション（詳細）">
            <input
              type="text"
              value={values.locationDetail}
              onChange={(e) => onChange({ locationDetail: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="世界観／設定">
            <input
              type="text"
              value={values.worldSetting}
              onChange={(e) => onChange({ worldSetting: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Field label="時間帯">
            <Select
              value={values.timeSlot}
              onChange={(v) => onChange({ timeSlot: v })}
              options={TIME_SLOTS}
            />
          </Field>
          <Field label="天候">
            <Select
              value={values.weather}
              onChange={(v) => onChange({ weather: v })}
              options={WEATHER_OPTIONS}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="空の描写">
            <textarea
              value={values.skyDesc}
              onChange={(e) => onChange({ skyDesc: e.target.value })}
              rows={3}
              className={`${textareaClass} min-h-0 resize-none`}
            />
          </Field>
          <Field label="ライティング">
            <textarea
              value={values.lighting}
              onChange={(e) => onChange({ lighting: e.target.value })}
              rows={3}
              className={`${textareaClass} min-h-0 resize-none`}
            />
          </Field>
        </div>

        <p className="text-[11px] text-[var(--text)] m-0">
          注釈 preview: top-left = 表 / 鍛冶, bottom-center = {'{location入力待ち}'}
        </p>
      </div>
    </SectionCard>
  )
}
