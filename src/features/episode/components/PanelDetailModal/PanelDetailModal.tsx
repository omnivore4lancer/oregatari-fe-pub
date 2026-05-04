import type { EpisodePanelData } from '../../types/episodePage'

interface Props {
  panel: EpisodePanelData | null
  open: boolean
  onClose: () => void
}

export function PanelDetailModal({ panel, open, onClose }: Props) {
  if (!open || !panel) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border)]">
          <p className="text-[14px] font-semibold text-[var(--text-h)]">コマ {panel.panelOrder} 詳細</p>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-[16px] cursor-pointer border-0 bg-transparent"
          >
            ×
          </button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {panel.description && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-[12px] text-amber-900 leading-relaxed">{panel.description}</p>
            </div>
          )}
          {panel.cameraAngle && (
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--text)]">
              <span>📷</span>
              <span>{panel.cameraAngle}</span>
              {panel.perspectiveIntensity && <span className="opacity-60">/ {panel.perspectiveIntensity}</span>}
            </div>
          )}
          {panel.characters.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-[var(--text)]">登場人物</p>
              {panel.characters.map((c, i) => (
                <div key={i} className="text-[12px] text-[var(--text)] bg-gray-50 rounded-lg px-3 py-2">
                  <span className="font-medium">{c.name}</span>
                  {c.emotion && <span className="ml-1.5 opacity-60 text-[11px]">— {c.emotion}</span>}
                  {c.pose && <span className="ml-1.5 opacity-60 text-[11px]">{c.pose}</span>}
                  {c.lines?.map((line, j) => (
                    <div key={j} className="mt-1 pl-2.5 border-l-2 border-amber-300 text-[11px] text-gray-700">
                      「{line.text}」
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {panel.effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {panel.effects.map((ef) => (
                <span key={ef} className="text-[11px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                  {ef}
                </span>
              ))}
            </div>
          )}
          {panel.lensAndLighting && (
            <p className="text-[11px] text-gray-400">{panel.lensAndLighting}</p>
          )}
        </div>
      </div>
    </div>
  )
}
