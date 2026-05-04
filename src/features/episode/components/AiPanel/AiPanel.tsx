import { ChevronDownIcon } from '../../../../components/Icons'

export function AiPanel() {
  return (
    <aside className="w-72 shrink-0 border-l border-[var(--border)] bg-[var(--bg)] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[var(--text-h)]">AI編集者</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-[var(--text)] hover:text-[var(--text-h)] cursor-pointer transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          <button
            type="button"
            className="text-[var(--text)] hover:text-[var(--text-h)] cursor-pointer transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text)] mb-2.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          参照中の情報
          <span className="ml-auto bg-gray-100 text-gray-500 text-[11px] px-1.5 py-0.5 rounded-full font-medium">
            2件
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-3 py-2 bg-[#f7f6f3] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
              <span className="text-[12px] text-[var(--text-h)] font-medium">作中情報</span>
            </div>
            <ChevronDownIcon size={11} />
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#f7f6f3] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className="text-[12px] text-[var(--text-h)] font-medium">
                ワーキングコンテキスト
              </span>
            </div>
            <ChevronDownIcon size={11} />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white">
          <input
            type="text"
            placeholder="編集者に相談する..."
            className="flex-1 text-[13px] bg-transparent outline-none text-[var(--text-h)] placeholder:text-gray-300"
          />
          <button
            type="button"
            className="text-[var(--text)] hover:text-[var(--accent)] cursor-pointer transition-colors shrink-0"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
