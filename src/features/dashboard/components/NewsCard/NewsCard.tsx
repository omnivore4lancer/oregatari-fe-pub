import { ExternalLinkIcon } from '../../../../components/Icons'
import type { NewsItem } from '../../types'

interface NewsCardProps {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <a
      href="#"
      className="shrink-0 w-44 p-3 rounded-[10px] bg-[var(--bg)] border border-[var(--border)] no-underline flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            item.tag === '新機能'
              ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
              : 'bg-gray-100 text-[var(--text)]'
          }`}
        >
          {item.tag}
        </span>
        <ExternalLinkIcon />
      </div>
      <span className="text-[11px] text-[var(--text)]">{item.date}</span>
      <span className="text-xs text-[var(--text-h)] leading-[1.45] line-clamp-2">{item.title}</span>
    </a>
  )
}
