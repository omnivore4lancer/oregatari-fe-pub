import { SectionCard } from '../../../../components/ui'
import type { MaterialVisualForm } from '../../types'
import { VisualField } from '../VisualField/VisualField'

interface VisualElementsSectionProps {
  values: MaterialVisualForm
  onChange: (updates: Partial<MaterialVisualForm>) => void
}

export function VisualElementsSection({ values, onChange }: VisualElementsSectionProps) {
  return (
    <SectionCard title="ビジュアル要素の内訳">
      <p className="text-[12px] text-[var(--text)] mb-4">
        具体名があると生成品質が安定します。複数要素の項目は1行に1つずつ入力してください。
      </p>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <VisualField
            label="前景 左: 構造物"
            value={values.fgLStructure}
            onChange={(v) => onChange({ fgLStructure: v })}
            rows={2}
          />
          <VisualField
            label="前景 左: 質感"
            value={values.fgLTexture}
            onChange={(v) => onChange({ fgLTexture: v })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <VisualField
            label="前景 左: 家具"
            note="（1行につき1要素）"
            value={values.fgLFurniture}
            onChange={(v) => onChange({ fgLFurniture: v })}
            rows={3}
          />
          <VisualField
            label="前景 左: 小物"
            note="（1行につき1要素）"
            value={values.fgLProps}
            onChange={(v) => onChange({ fgLProps: v })}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <VisualField
            label="中景 中央: 地面"
            value={values.mgCGround}
            onChange={(v) => onChange({ mgCGround: v })}
            rows={2}
          />
          <VisualField
            label="中景 中央: 装飾"
            value={values.mgCDecoration}
            onChange={(v) => onChange({ mgCDecoration: v })}
            rows={2}
          />
          <VisualField
            label="中景 中央: 活気"
            value={values.mgCAtmosphere}
            onChange={(v) => onChange({ mgCAtmosphere: v })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <VisualField
            label="中景 右: 構造物"
            note="（1行につき1要素）"
            value={values.mgRStructure}
            onChange={(v) => onChange({ mgRStructure: v })}
            rows={3}
          />
          <VisualField
            label="中景 右: アイテム"
            note="（1行につき1要素）"
            value={values.mgRItems}
            onChange={(v) => onChange({ mgRItems: v })}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <VisualField
            label="背景: 建築"
            value={values.bgBuilding}
            onChange={(v) => onChange({ bgBuilding: v })}
            rows={2}
          />
          <VisualField
            label="背景: 地形"
            value={values.bgTerrain}
            onChange={(v) => onChange({ bgTerrain: v })}
            rows={2}
          />
        </div>
      </div>
    </SectionCard>
  )
}
