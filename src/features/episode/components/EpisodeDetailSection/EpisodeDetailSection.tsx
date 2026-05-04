import { inputClass, textareaClass } from '../../../../components/ui'

interface Props {
  title: string
  summary: string
  content: string
  onTitleChange: (value: string) => void
  onSummaryChange: (value: string) => void
  onContentChange: (value: string) => void
}

export function EpisodeDetailSection({
  title,
  summary,
  content,
  onTitleChange,
  onSummaryChange,
  onContentChange,
}: Props) {
  return (
    <section className="h-full">
      <div className="flex gap-4 h-full">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-h)] mb-1.5">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="エピソードのタイトルを入力..."
              className={inputClass}
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-[12px] font-medium text-[var(--text-h)] mb-1.5">
              概要
            </label>
            <textarea
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="このエピソードの概要を入力。AI編集者の参考にするために詳しく記述できます"
              className={`${textareaClass} flex-1 resize-none`}
            />
          </div>
        </div>

        <div className="flex-[2] min-w-0 flex flex-col">
          <label className="block text-[12px] font-medium text-[var(--text-h)] mb-1.5">本文</label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="エピソードの本文（シナリオ）を入力..."
            className={`${textareaClass} flex-1 resize-none`}
          />
        </div>
      </div>
    </section>
  )
}
