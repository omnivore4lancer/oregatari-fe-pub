import { SpinnerDots } from '../../../../components/ui'
import type { Episode } from '../../types'

interface PreviewPanelProps {
  episode: Episode | null
}

export function PreviewPanel({ episode }: PreviewPanelProps) {
  return (
    <aside className="w-[50%] shrink-0 border-l border-[var(--border)] bg-[var(--bg)] flex flex-col">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h2 className="text-[14px] font-bold text-[var(--text-h)] m-0">プレビュー</h2>
      </div>
      {episode === null || episode.generatingState === 'generating' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {episode === null ? (
            <p className="text-[13px] text-[var(--text)]">
              エピソードを選択するとプレビューが表示されます
            </p>
          ) : (
            <>
              <SpinnerDots size="md" />
              <p className="text-[14px] font-medium text-[var(--accent)] mt-3 mb-1">
                エピソード生成中...
              </p>
              <p className="text-[12px] text-[var(--text)]">生成が完了すると詳細が表示されます</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[11px] font-semibold text-[var(--text-h)] mb-2">{episode.title}</p>
          {episode.description && (
            <p className="text-[11px] text-[var(--text)] leading-relaxed mb-4">{episode.description}</p>
          )}
          {episode.content && (
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-[10px] font-semibold text-[var(--text-h)] mb-3 tracking-wider uppercase">本文</p>
              <div className="text-[15px] text-gray-800 leading-[1.9] font-serif tracking-wide">
                {episode.content.split('\n').map((line, i) => (
                  <p key={i} className={`m-0 ${line.startsWith('○') ? 'underline underline-offset-4' : ''}`}>
                    {line || ' '}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
