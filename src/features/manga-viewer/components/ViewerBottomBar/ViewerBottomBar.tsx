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
        className="px-3 py-1 text-[12px] text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors border-0 bg-transparent cursor-pointer"
      >
        {isFullscreen ? '縮小' : '全画面'}
      </button>

      <div className="w-px h-4 bg-white/15" />

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 px-3 py-1 text-[12px] text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors border-0 bg-transparent cursor-pointer"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        一覧
      </button>
    </div>
  )
}
