const STEPS = ['種類選択', '詳細設定', '内容編集']

interface Props {
  currentStep: number
}

export function StepNav({ currentStep }: Props) {
  return (
    <nav className="flex items-center gap-2 text-[12px] mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span className={i === currentStep ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text)]'}>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="text-gray-300 text-[10px]">›</span>}
        </div>
      ))}
    </nav>
  )
}
