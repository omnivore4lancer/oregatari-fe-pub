import { BookIcon } from '../../../Icons'

export function SubNav() {
  return (
    <nav className="flex items-center px-6 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
      <a href="#" className="flex items-center gap-1.5 text-[13px] text-[var(--text)] no-underline">
        <BookIcon />
        コミュニティの物語を見る
      </a>
    </nav>
  )
}
