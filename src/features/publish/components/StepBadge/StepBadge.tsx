interface StepBadgeProps {
  n: string
}

export function StepBadge({ n }: StepBadgeProps) {
  return (
    <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] flex items-center justify-center font-bold shrink-0">
      {n}
    </span>
  )
}
