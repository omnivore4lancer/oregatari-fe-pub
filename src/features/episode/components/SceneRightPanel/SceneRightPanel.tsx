import { PagePreview } from '../PagePreview/PagePreview'
import type { EpisodePageData, EpisodePanelData } from '../../types/episodePage'

type SidebarTab = 'settings' | 'detail'

interface Props {
  selectedPage: EpisodePageData | null
  selectedPanel: EpisodePanelData | null
  tab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  onSelectPanel: (panel: EpisodePanelData) => void
}

export function SceneRightPanel({ selectedPage, selectedPanel, tab, onTabChange, onSelectPanel }: Props) {
  return (
    <div className="w-72 border-l border-[var(--border)] flex flex-col bg-[var(--bg)] shrink-0 overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        {(['settings', 'detail'] as SidebarTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className={`flex-1 py-2.5 text-[12px] font-medium transition-colors cursor-pointer border-0 bg-transparent ${
              tab === t
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text)] hover:text-[var(--text-h)]'
            }`}
          >
            {t === 'settings' ? 'ページ設定' : '詳細確認'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'settings' ? (
          <div className="p-3 flex flex-col gap-3">
            {selectedPage && (
              <div>
                <p className="text-[11px] text-[var(--text)] mb-2">コマ一覧</p>
                <div style={{ aspectRatio: '1 / 1.4' }}>
                  <PagePreview
                    page={selectedPage}
                    selectedPanelId={selectedPanel?.id}
                    onSelectPanel={onSelectPanel}
                    structureOnly
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-3">
            {selectedPage?.rows.map((row) => (
              <div key={row.id}>
                <p className="text-[10px] text-[var(--text)] font-medium mb-1.5">
                  段{row.rowNumber}（{row.heightRatio}）— {row.layoutType}
                </p>
                {row.panels.map((panel) => (
                  <div key={panel.id} className="mb-2 bg-gray-50 rounded-lg p-2.5 border border-[var(--border)]">
                    <p className="text-[11px] font-semibold text-[var(--text-h)] mb-1">コマ {panel.panelOrder}</p>
                    {panel.description && (
                      <p className="text-[10px] text-[var(--text)] leading-relaxed mb-1">{panel.description}</p>
                    )}
                    {panel.cameraAngle && <p className="text-[10px] text-gray-400">📷 {panel.cameraAngle}</p>}
                    {panel.imagePrompt && (
                      <details className="mt-1">
                        <summary className="text-[10px] text-[var(--accent)] cursor-pointer">画像プロンプト</summary>
                        <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">{panel.imagePrompt}</p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
