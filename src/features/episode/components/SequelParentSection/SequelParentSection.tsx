import type { Episode } from '../../types'

interface Props {
  episodes: Episode[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export function SequelParentSection({ episodes, selectedId, onSelect }: Props) {
  const selected = episodes.find((e) => e.id === selectedId)

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--text)]"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <h2 className="text-[15px] font-semibold text-[var(--text-h)] m-0">
          どのエピソードの続編？
        </h2>
      </div>

      {selected && (
        <div className="border border-[var(--accent)] rounded-xl p-4 mb-3 bg-white shadow-[0_0_0_3px_var(--accent-bg)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-[14px] text-[var(--text-h)] mb-1.5">
                {selected.title}
              </div>
              <div className="text-[12px] text-[var(--text)] leading-relaxed line-clamp-2">
                {selected.description}
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 text-[11px] text-[var(--accent)] border border-[var(--accent)] px-2 py-0.5 rounded-md hover:bg-[var(--accent-bg)] transition-colors cursor-pointer"
            >
              変更
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            type="button"
            onClick={() => onSelect(ep.id)}
            className={`text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${
              ep.id === selectedId
                ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                : 'border-[var(--border)] bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="text-[11px] text-[var(--text)] mb-0.5">EP{ep.number}</div>
            <div className="font-semibold text-[13px] text-[var(--text-h)] mb-1">{ep.title}</div>
            <div className="text-[11px] text-[var(--text)] leading-relaxed line-clamp-2">
              {ep.description}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
