import { SectionHeader } from '../../../../components/ui'
import type { CharacterDetail } from '../../types'

interface InfoGridProps {
  character: CharacterDetail
}

const INFO_ITEMS: { label: string; key: keyof CharacterDetail }[] = [
  { label: '概要', key: 'overview' },
  { label: '性格', key: 'personality' },
  { label: '背景', key: 'background' },
  { label: '動機', key: 'motivation' },
]

export function InfoGrid({ character }: InfoGridProps) {
  return (
    <section>
      <SectionHeader icon={<span className="text-[15px]">👤</span>} title="キャラクター情報" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
        {INFO_ITEMS.map(({ label, key }) => (
          <div key={label}>
            <p className="text-[12px] font-bold text-[var(--text-h)] mb-1.5 flex items-center gap-1">
              <span className="text-[10px] text-[var(--text)]">✦</span>
              {label}
            </p>
            <p className="text-[13px] text-[var(--text)] leading-relaxed m-0">
              {character[key] as string}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[12px] font-bold text-[var(--text-h)] mb-2 flex items-center gap-1">
          <span className="text-[10px] text-[var(--text)]">⚡</span>
          スキル・能力
        </p>
        <div className="flex flex-wrap gap-2">
          {character.skills.map((skill) => (
            <span
              key={skill}
              className="text-[12px] text-[var(--text-h)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
