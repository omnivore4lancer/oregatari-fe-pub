import { useEffect } from 'react'

import { MangaSpread, ViewerBottomBar } from '../../../manga-viewer'
import { usePublicMangaViewer } from '../../hooks/usePublicMangaViewer'
import type { PublicEpisode } from '../../types'

interface PublicMangaViewerProps {
  episode: PublicEpisode
  coverImageUrl: string | null
  onClose: () => void
}

export function PublicMangaViewer({ episode, coverImageUrl, onClose }: PublicMangaViewerProps) {
  const {
    containerRef,
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
  } = usePublicMangaViewer({ episode, coverImageUrl })

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div
        ref={containerRef}
        className="flex flex-col w-full h-full bg-[#111] select-none overflow-hidden"
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
          episodeNumber={episode.number}
          episodeTitle={episode.title}
          currentPage={pageIndex + 1}
          totalPages={totalPages}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBack={onClose}
        />
      </div>
    </div>
  )
}
