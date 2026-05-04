interface MaterialCardProps {
  title: string
  date: string
}

export function MaterialCard({ title, date }: MaterialCardProps) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden cursor-pointer hover:border-[var(--accent-border)] transition-colors w-[180px]">
      <div className="w-full h-[120px] bg-gradient-to-br from-slate-700 via-slate-600 to-indigo-900 flex items-end relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-[9px] text-white/80 leading-tight line-clamp-1">
            シンガーソングライターとして活躍している女性の一人暮らしの部屋
          </p>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-[var(--text-h)] mb-0.5">{title}</p>
        <p className="text-[11px] text-[var(--text)]">{date}</p>
      </div>
    </div>
  )
}
