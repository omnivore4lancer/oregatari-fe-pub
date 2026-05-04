import { inputClass, textareaClass } from '../../../../components/ui'

interface Props {
  title: string
  summary: string
  content: string
  onTitleChange: (value: string) => void
  onSummaryChange: (value: string) => void
  onContentChange: (value: string) => void
}

export function EpisodeDetailSection({ title, summary, content, onTitleChange, onSummaryChange, onContentChange }: Props) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--text)]"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <h2 className="text-[15px] font-semibold text-[var(--text-h)] m-0">エピソード詳細</h2>
      </div>

      <div className="flex flex-col gap-4">
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

        <div>
          <label className="block text-[12px] font-medium text-[var(--text-h)] mb-1.5">
            概要
          </label>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="このエピソードの概要を入力。AI編集者の参考にするために詳しく記述できます"
            className={`${textareaClass} min-h-[80px]`}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[var(--text-h)] mb-1.5">
            本文
          </label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="エピソードの本文（シナリオ）を入力..."
            className={`${textareaClass} min-h-[320px]`}
          />
        </div>
      </div>
    </section>
  )
}
