interface ViewerBottomBarProps {
  episodeNumber: number
  episodeTitle: string
  currentPage: number
  totalPages: number
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onBack: () => void
}

export function ViewerBottomBar({
  episodeNumber,
  episodeTitle,
  currentPage,
  totalPages,
  isFullscreen,
  onToggleFullscreen,
  onBack,
}: ViewerBottomBarProps) {
  return (
    <div className="shrink-0 flex items-center px-5 h-11 bg-[#1c1c1c] border-t border-white/8 gap-4">
      <span className="text-white/80 text-[13px] font-medium">
        第{episodeNumber}話{episodeTitle ? `　${episodeTitle}` : ''}
      </span>

      <div className="flex-1" />

      {totalPages > 0 && (
        <span className="text-white/30 text-[12px]">
          {currentPage} / {totalPages}
        </span>
      )}

      <div className="w-px h-4 bg-white/15" />

      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? '全画面終了' : '全画面表示'}
        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors border-0 bg-transparent cursor-pointer"
      >
        {isFullscreen ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 3 3 3 3 8" />
            <polyline points="21 8 21 3 16 3" />
            <polyline points="3 16 3 21 8 21" />
            <polyline points="16 21 21 21 21 16" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      <div className="w-px h-4 bg-white/15" />

      <button
        type="button"
        onClick={onBack}
        aria-label="一覧に戻る"
        className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors border-0 bg-transparent cursor-pointer"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
