interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function InheritRelationToggle({ checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between mb-8 py-3 px-4 rounded-xl border border-[var(--border)] bg-white">
      <div>
        <div className="text-[13px] font-semibold text-[var(--text-h)] mb-0.5">
          人間関係を引き継ぐ
        </div>
        <div className="text-[11px] text-[var(--text)]">
          現エピソードで登場するキャラクターの関係を参照します。
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 ml-4 w-10 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-[var(--accent)]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
