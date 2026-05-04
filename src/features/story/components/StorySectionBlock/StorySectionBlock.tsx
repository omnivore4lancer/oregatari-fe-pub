interface StorySectionBlockProps {
  tag: string
  content: string
}

export function StorySectionBlock({ tag, content }: StorySectionBlockProps) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-[13px] font-bold text-[var(--text-h)] mb-1">【{tag}】</p>
      <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  )
}
