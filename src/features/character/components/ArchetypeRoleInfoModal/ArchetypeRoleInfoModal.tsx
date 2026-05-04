import {
  ARCHETYPE_ROLE_DESCRIPTIONS,
  ARCHETYPE_ROLE_LABELS,
  type ArchetypeRole,
} from '../../types'

interface Props {
  archetypeRole: ArchetypeRole | null
  onClose: () => void
}

export function ArchetypeRoleInfoModal({ archetypeRole, onClose }: Props) {
  if (archetypeRole == null) return null

  const label = ARCHETYPE_ROLE_LABELS[archetypeRole]
  const { summary, traits } = ARCHETYPE_ROLE_DESCRIPTIONS[archetypeRole]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <p className="text-[10px] text-[var(--text)] mb-0.5">配役タイプ</p>
            <h2 className="text-[15px] font-bold text-[var(--accent)] m-0">{label}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors cursor-pointer bg-transparent border-none p-1 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <p className="text-[13px] text-[var(--text)] leading-relaxed m-0">{summary}</p>

          <div>
            <p className="text-[11px] font-bold text-[var(--text-h)] mb-2">特徴</p>
            <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
              {traits.map((trait) => (
                <li key={trait} className="flex items-start gap-2 text-[12px] text-[var(--text)]">
                  <span className="text-[var(--accent)] shrink-0 mt-px">✦</span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
