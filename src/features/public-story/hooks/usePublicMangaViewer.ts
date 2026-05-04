import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useApiError } from '../../../contexts/ApiErrorContext'
import type { ViewerPage } from '../../manga-viewer'
import { publicStoryApi } from '../api/publicStoryApi'
import type { PublicEpisode } from '../types'

interface UsePublicMangaViewerOptions {
  episode: PublicEpisode
  coverImageUrl: string | null
}

export function usePublicMangaViewer({ episode, coverImageUrl }: UsePublicMangaViewerOptions) {
  const { showError } = useApiError()
  const containerRef = useRef<HTMLDivElement>(null)

  const [pageIndex, setPageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const pagesQuery = useQuery({
    queryKey: ['public-episode-pages', episode.id],
    queryFn: () => publicStoryApi.getEpisodePages(episode.id),
  })

  useEffect(() => {
    if (pagesQuery.error) showError(pagesQuery.error)
  }, [pagesQuery.error, showError])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setPageIndex((i) => (i % 2 === 0 ? i : i - 1))
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const viewerPages: ViewerPage[] = pagesQuery.isLoading
    ? []
    : [
        { type: 'cover', episodeNumber: episode.number, episodeTitle: episode.title, coverImageUrl },
        { type: 'title', episodeNumber: episode.number, episodeTitle: episode.title },
        ...(pagesQuery.data ?? []).map((data) => ({ type: 'manga' as const, data })),
      ]

  const total = viewerPages.length
  const step = isMobile ? 1 : 2
  const maxPageIndex = total > 0 ? Math.floor((total - 1) / step) * step : 0

  const rightPage = viewerPages[pageIndex] ?? null
  const leftPage = isMobile ? null : (viewerPages[pageIndex + 1] ?? null)
  const canGoNext = pageIndex < maxPageIndex
  const canGoPrev = pageIndex > 0

  const goNext = useCallback(() => {
    setPageIndex((i) => Math.min(i + step, maxPageIndex))
  }, [step, maxPageIndex])

  const goPrev = useCallback(() => {
    setPageIndex((i) => Math.max(i - step, 0))
  }, [step])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goNext()
      if (e.key === 'ArrowRight') goPrev()
      if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return {
    containerRef,
    pageIndex,
    totalPages: total,
    rightPage,
    leftPage,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    isMobile,
    isLoading: pagesQuery.isLoading,
    isFullscreen,
    toggleFullscreen,
  }
}
