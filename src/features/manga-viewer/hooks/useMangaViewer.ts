import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { queryKeys } from '../../../lib/queryKeys'
import { episodeApi, episodePageApi, type EpisodePageData } from '../../episode'
import { storyApi } from '../../story'
import type { ViewerPage } from '../types'

interface UseMangaViewerOptions {
  storyId: number
  episodeId: number
}

export function useMangaViewer({ storyId, episodeId }: UseMangaViewerOptions) {
  const { showError } = useApiError()
  const containerRef = useRef<HTMLDivElement>(null)

  const [pageIndex, setPageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const pagesQuery = useQuery({
    queryKey: queryKeys.episodePages(storyId, episodeId),
    queryFn: () => episodePageApi.getPages(storyId, episodeId),
  })
  const episodeQuery = useQuery({
    queryKey: queryKeys.episode(storyId, episodeId),
    queryFn: () => episodeApi.getEpisode(storyId, episodeId),
  })
  const storyQuery = useQuery({
    queryKey: queryKeys.story(storyId),
    queryFn: () => storyApi.getStory(storyId),
  })

  const isLoading = pagesQuery.isLoading || episodeQuery.isLoading || storyQuery.isLoading
  const firstError = pagesQuery.error ?? episodeQuery.error ?? storyQuery.error
  useEffect(() => {
    if (firstError) showError(firstError)
  }, [firstError, showError])

  const pages: EpisodePageData[] = pagesQuery.data ?? []
  const episodeTitle = episodeQuery.data?.title ?? ''
  const episodeNumber = episodeQuery.data?.number ?? 0
  const coverImageUrl = storyQuery.data?.coverImageUrl ?? null

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setPageIndex((i) => (i % 2 === 0 ? i : i - 1))
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const viewerPages: ViewerPage[] = isLoading
    ? []
    : [
        { type: 'cover', episodeNumber, episodeTitle, coverImageUrl },
        { type: 'title', episodeNumber, episodeTitle },
        ...pages.map((data) => ({ type: 'manga' as const, data })),
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
    episodeTitle,
    episodeNumber,
    pageIndex,
    totalPages: total,
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
  }
}
