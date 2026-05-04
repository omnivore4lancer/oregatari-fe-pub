import { useNavigate, useParams } from 'react-router-dom'

import { MangaSpread, ViewerBottomBar, useMangaViewer } from '../../features/manga-viewer'

export default function MangaViewerPage() {
  const navigate = useNavigate()
  const { id, episodeId } = useParams()

  const {
    containerRef,
    episodeTitle,
    episodeNumber,
    pageIndex,
    totalPages,
    rightPage,
    leftPage,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    isMobile,
    isLoading,
    isFullscreen,
    toggleFullscreen,
  } = useMangaViewer({ storyId: Number(id), episodeId: Number(episodeId) })

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-screen h-screen bg-[#111] select-none overflow-hidden"
    >
      <MangaSpread
        rightPage={rightPage}
        leftPage={leftPage}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        onNext={goNext}
        onPrev={goPrev}
        isMobile={isMobile}
        loading={isLoading}
      />
      <ViewerBottomBar
        episodeNumber={episodeNumber}
        episodeTitle={episodeTitle}
        currentPage={pageIndex + 1}
        totalPages={totalPages}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={() => navigate(`/stories/${id}/episodes`)}
      />
    </div>
  )
}
