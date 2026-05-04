import { filterTabs } from '../../constants'
import type { FilterTab } from '../../types'

interface FilterBarProps {
  active: FilterTab
  onChange: (tab: FilterTab) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {filterTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(active === tab.key ? 'all' : tab.key)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
            active === tab.key
              ? 'border-[var(--accent-border)] text-[var(--accent)] bg-[var(--accent-bg)]'
              : 'border-[var(--border)] text-[var(--text)] bg-transparent hover:border-[var(--accent-border)] hover:text-[var(--accent)]'
          }`}
        >
          {tab.icon && <span className="text-[10px]">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
