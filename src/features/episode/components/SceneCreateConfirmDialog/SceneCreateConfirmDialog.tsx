import { Button } from '../../../../components/ui'
import { SpinnerDots } from '../../../../components/ui'

interface SceneCreateConfirmDialogProps {
  open: boolean
  episodeTitle: string
  generating: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function SceneCreateConfirmDialog({
  open,
  episodeTitle,
  generating,
  onConfirm,
  onCancel,
}: SceneCreateConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={generating ? undefined : onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[var(--text-h)] mb-2">ページを作成</h2>
        <p className="text-[13px] text-[var(--text)] leading-relaxed mb-6">
          「{episodeTitle}」のページデータを生成します。
          <br />
          AIがエピソード内容をもとに自動でページを作成します。
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={generating}
            className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          <Button variant="primary" onClick={onConfirm} disabled={generating} className="!py-2 text-[13px]">
            {generating ? (
              <span className="flex items-center gap-2">
                <SpinnerDots size="sm" />
                生成中...
              </span>
            ) : (
              '生成する'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
