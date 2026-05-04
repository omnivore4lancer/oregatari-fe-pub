import { useRef, useState } from 'react'

import { ImageIcon, SparkleIcon, TrashIcon } from '../../../../components/Icons'
import type { Panel } from '../../types'

interface Props {
  panel: Panel | null
  onUpdate: (updated: Panel) => void
  onDelete: (id: string) => void
}

export function PanelDetail({ panel, onUpdate, onDelete }: Props) {
  const [prevPanelId, setPrevPanelId] = useState(panel?.id)
  const [promptDraft, setPromptDraft] = useState(panel?.prompt ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (panel?.id !== prevPanelId) {
    setPrevPanelId(panel?.id)
    setPromptDraft(panel?.prompt ?? '')
  }

  if (!panel) {
    return (
      <div className="w-80 shrink-0 border-l border-[var(--border)] bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[13px] text-[var(--text)] text-center px-6 leading-relaxed">
          コマをクリックして
          <br />
          詳細を編集できます
        </p>
      </div>
    )
  }

  function handleImageFile(file: File) {
    if (!panel) return
    const prev = panel.imageUrl
    if (prev) URL.revokeObjectURL(prev)
    onUpdate({ ...panel, imageUrl: URL.createObjectURL(file) })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleImageFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleImageFile(file)
  }

  function handlePromptBlur() {
    if (!panel) return
    if (promptDraft !== panel.prompt) {
      onUpdate({ ...panel, prompt: promptDraft })
    }
  }

  function handleImageClear() {
    if (!panel) return
    if (panel.imageUrl) URL.revokeObjectURL(panel.imageUrl)
    onUpdate({ ...panel, imageUrl: null })
  }

  return (
    <div className="w-80 shrink-0 border-l border-[var(--border)] bg-[var(--bg)] flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <h3 className="text-[14px] font-semibold text-[var(--text-h)] m-0">コマ詳細</h3>
        <button
          type="button"
          onClick={() => onDelete(panel.id)}
          title="コマを削除"
          className="p-1.5 rounded text-red-400 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
        >
          <TrashIcon size={14} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Image upload */}
        <div>
          <label className="block text-[12px] font-medium text-[var(--text-h)] mb-2">画像</label>
          {panel.imageUrl ? (
            <div className="relative group rounded border border-[var(--border)] overflow-hidden">
              <img src={panel.imageUrl} alt="" className="w-full object-cover max-h-52" />
              <button
                type="button"
                onClick={handleImageClear}
                className="absolute top-1.5 right-1.5 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
              >
                <TrashIcon size={12} />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-[var(--border)] rounded-lg p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={22} />
              <p className="text-[11px] text-[var(--text)] text-center leading-relaxed m-0">
                クリックまたは
                <br />
                ドラッグ&ドロップ
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-[12px] font-medium text-[var(--text-h)] mb-2">
            プロンプト
          </label>
          <textarea
            value={promptDraft}
            onChange={(e) => setPromptDraft(e.target.value)}
            onBlur={handlePromptBlur}
            placeholder="このコマの内容を描写してください..."
            rows={6}
            className="w-full text-[13px] px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] resize-none focus:outline-none focus:border-[var(--accent-border)] focus:ring-1 focus:ring-[var(--accent-border)] placeholder:text-[var(--text)]"
          />
        </div>

        {/* Generate button */}
        <button
          type="button"
          className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-br from-purple-400 via-purple-500 to-violet-700 shadow-[0_2px_8px_rgba(168,85,247,0.35)] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 border-0"
        >
          <SparkleIcon size={13} />
          画像を生成
        </button>
      </div>
    </div>
  )
}
