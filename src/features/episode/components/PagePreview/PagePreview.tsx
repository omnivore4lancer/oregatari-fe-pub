import { memo } from 'react'

import type { EpisodePageData, EpisodePanelData, EpisodePageRowData } from '../../types/episodePage'

interface PagePreviewProps {
  page: EpisodePageData
  selectedPanelId?: number | null
  onSelectPanel?: (panel: EpisodePanelData) => void
  mini?: boolean
  structureOnly?: boolean
}

function getColumnCount(layoutType: string): number {
  if (layoutType.includes('3')) return 3
  if (
    layoutType.includes('左右') ||
    layoutType.includes('均等') ||
    layoutType.includes('2') ||
    layoutType.includes('二')
  )
    return 2
  return 1
}

function parseHeightRatio(ratio: string): number {
  return parseFloat(ratio.replace('%', '')) || 33
}

interface PanelCellProps {
  panel: EpisodePanelData
  selected: boolean
  onClick: () => void
  mini: boolean
  structureOnly: boolean
}

function PanelCell({ panel, selected, onClick, mini, structureOnly }: PanelCellProps) {
  const showImage = !structureOnly && !!panel.imageUrl

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden transition-all cursor-pointer border-0 p-0 m-0 ${
        selected ? 'ring-2 ring-[var(--accent)] ring-inset z-10' : ''
      }`}
    >
      {showImage ? (
        <img
          src={panel.imageUrl!}
          alt={panel.description ?? `panel ${panel.panelOrder}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-1 p-1">
          <span className={`text-gray-400 font-bold ${mini ? 'text-[8px]' : 'text-[11px]'}`}>
            {panel.panelOrder}
          </span>
          {!mini && panel.description && (
            <p className="text-[9px] text-gray-400 text-center line-clamp-3 px-1 leading-relaxed">
              {panel.description}
            </p>
          )}
        </div>
      )}

      {/* frame border */}
      {panel.frame !== 'none' && (
        <div className="absolute inset-0 border border-gray-800 pointer-events-none" />
      )}
    </button>
  )
}

interface RowBlockProps {
  row: EpisodePageRowData
  heightPct: number
  selectedPanelId: number | null | undefined
  onSelectPanel: (panel: EpisodePanelData) => void
  mini: boolean
  structureOnly: boolean
}

function horizontalPriority(pagePosition: string | null): number {
  const pos = (pagePosition ?? '').toLowerCase()
  if (pos.endsWith('left')) return 0
  if (pos.endsWith('center') || pos.endsWith('full')) return 1
  if (pos.endsWith('right')) return 2
  return 1
}

function sortPanelsForDisplay(panels: EpisodePanelData[]): EpisodePanelData[] {
  const hasPositions = panels.some((p) => p.pagePosition)
  if (hasPositions) {
    // left(0) → center/full(1) → right(2) の順で左→右に配置
    return [...panels].sort((a, b) => {
      const pa = horizontalPriority(a.pagePosition)
      const pb = horizontalPriority(b.pagePosition)
      if (pa !== pb) return pa - pb
      return a.panelOrder - b.panelOrder
    })
  }
  // pagePosition 未設定: panelOrder=1 が右端（日本語漫画の右→左読み）
  return [...panels].reverse()
}

function RowBlock({ row, heightPct, selectedPanelId, onSelectPanel, mini, structureOnly }: RowBlockProps) {
  const cols = getColumnCount(row.layoutType)
  const sortedPanels = sortPanelsForDisplay(row.panels)

  return (
    <div
      className="flex flex-row w-full"
      style={{ height: `${heightPct}%` }}
    >
      {sortedPanels.map((panel) => (
        <div key={panel.id} className="flex-1 h-full">
          <PanelCell
            panel={panel}
            selected={selectedPanelId === panel.id}
            onClick={() => onSelectPanel(panel)}
            mini={mini}
            structureOnly={structureOnly}
          />
        </div>
      ))}
      {/* fill empty columns if panels < cols */}
      {Array.from({ length: Math.max(0, cols - sortedPanels.length) }).map((_, i) => (
        <div key={`empty-${i}`} className="flex-1 h-full bg-gray-50 border border-gray-200" />
      ))}
    </div>
  )
}

export const PagePreview = memo(function PagePreview({
  page,
  selectedPanelId,
  onSelectPanel,
  mini = false,
  structureOnly = false,
}: PagePreviewProps) {
  const totalRaw = page.rows.reduce((s, r) => s + parseHeightRatio(r.heightRatio), 0)

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-300 overflow-hidden">
      {page.rows.map((row) => {
        const heightPct = (parseHeightRatio(row.heightRatio) / totalRaw) * 100
        return (
          <RowBlock
            key={row.id}
            row={row}
            heightPct={heightPct}
            selectedPanelId={selectedPanelId}
            onSelectPanel={onSelectPanel ?? (() => {})}
            mini={mini}
            structureOnly={structureOnly}
          />
        )
      })}
    </div>
  )
})
