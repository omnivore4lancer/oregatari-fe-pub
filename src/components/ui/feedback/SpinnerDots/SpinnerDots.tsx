type SpinnerSize = 'sm' | 'md'

interface SpinnerDotsProps {
  size?: SpinnerSize
}

const dotClass: Record<SpinnerSize, string> = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
}

export function SpinnerDots({ size = 'sm' }: SpinnerDotsProps) {
  const dot = dotClass[size]
  return (
    <span className="inline-flex items-center gap-0.5">
      <span
        className={`${dot} rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0ms]`}
      />
      <span
        className={`${dot} rounded-full bg-[var(--accent)] animate-bounce [animation-delay:150ms]`}
      />
      <span
        className={`${dot} rounded-full bg-[var(--accent)] animate-bounce [animation-delay:300ms]`}
      />
    </span>
  )
}
