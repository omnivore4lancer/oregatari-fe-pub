import { useCallback, useEffect, useRef, useState } from 'react'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { DetailedError } from '../../../contexts/ApiErrorContext'
import { episodePageApi, type ActiveJob } from '../api/episodePageApi'
import type { EpisodePageData } from '../types/episodePage'

const POLL_INTERVAL_MS = 3000

function isGeminiOverloadError(msg: string): boolean {
  const lower = msg.toLowerCase()
  return (
    lower.includes('503') ||
    lower.includes('service unavailable') ||
    lower.includes('high demand') ||
    lower.includes('experiencing high demand') ||
    lower.includes('try again later') ||
    lower.includes('overloaded')
  )
}

function toDetailedError(e: unknown, fallbackLabel: string): DetailedError {
  const rawMsg =
    e instanceof Error ? e.message : typeof e === 'string' ? e : '不明なエラーが発生しました'
  const detail =
    e instanceof Error && (e as Error & { detail?: string }).detail
      ? (e as Error & { detail?: string }).detail!
      : rawMsg
  const friendly =
    isGeminiOverloadError(rawMsg) || isGeminiOverloadError(detail)
      ? 'Geminiサーバーが混雑しています。しばらく待ってから再試行してください。'
      : fallbackLabel
  return new DetailedError(friendly, detail)
}

interface UseSceneJobsOptions {
  onPagesUpdated: (pages: EpisodePageData[]) => void
  onLayoutCompleted: (pages: EpisodePageData[]) => void
}

export interface SceneJobsState {
  generatingPages: Set<number>
  regeneratingLayout: boolean
  lastUsedModel: string | null
  lastImageModel: string | null
}

export function useSceneJobs(
  storyId: number,
  epId: number,
  { onPagesUpdated, onLayoutCompleted }: UseSceneJobsOptions,
) {
  const { showError } = useApiError()
  const [generatingPages, setGeneratingPages] = useState<Set<number>>(new Set())
  const [regeneratingLayout, setRegeneratingLayout] = useState(false)
  const [lastUsedModel, setLastUsedModel] = useState<string | null>(null)
  const [lastImageModel, setLastImageModel] = useState<string | null>(null)

  const generatingPagesRef = useRef<Set<number>>(new Set())
  const regeneratingLayoutRef = useRef(false)
  useEffect(() => { generatingPagesRef.current = generatingPages }, [generatingPages])
  useEffect(() => { regeneratingLayoutRef.current = regeneratingLayout }, [regeneratingLayout])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (generatingPagesRef.current.size === 0 && !regeneratingLayoutRef.current) return
      try {
        const activeJobs = await episodePageApi.getActiveJobs(storyId, epId)

        // 画像生成ジョブ
        const runningImageNums = new Set(
          activeJobs
            .filter((j) => j.status === 'running' && j.jobType === 'image_generation' && j.pageNumber !== null)
            .map((j) => j.pageNumber as number),
        )
        const completedPages = [...generatingPagesRef.current].filter((n) => !runningImageNums.has(n))
        if (completedPages.length > 0) {
          const failedImageJobs = activeJobs.filter(
            (j) => j.status === 'failed' && j.jobType === 'image_generation',
          )
          for (const job of failedImageJobs) {
            showError(toDetailedError(job.errorMessage ?? '画像生成に失敗しました', '画像生成に失敗しました'))
          }
          const doneJob = activeJobs.find((j) => j.status === 'done' && j.jobType === 'image_generation' && j.imageModel)
          if (doneJob?.imageModel) setLastImageModel(doneJob.imageModel)
          const pages = await episodePageApi.getPages(storyId, epId)
          onPagesUpdated(pages)
          setGeneratingPages((prev) => {
            const next = new Set(prev)
            completedPages.forEach((n) => next.delete(n))
            return next
          })
        }

        // コマ割りジョブ
        if (regeneratingLayoutRef.current) {
          const layoutRunning = activeJobs.some((j) => j.status === 'running' && j.jobType === 'panel_layout')
          const layoutFailed = activeJobs.find((j) => j.status === 'failed' && j.jobType === 'panel_layout')
          if (!layoutRunning) {
            if (layoutFailed) {
              showError(toDetailedError(layoutFailed.errorMessage ?? 'コマ割り生成に失敗しました', 'コマ割り生成に失敗しました'))
            } else {
              const doneJob = activeJobs.find((j) => j.status === 'done' && j.jobType === 'panel_layout')
              if (doneJob?.usedModel) setLastUsedModel(doneJob.usedModel)
              const pages = await episodePageApi.getPages(storyId, epId)
              onLayoutCompleted(pages)
            }
            setRegeneratingLayout(false)
          }
        }
      } catch {
        // ポーリングエラーは無視（次のインターバルで再試行）
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [storyId, epId, showError, onPagesUpdated, onLayoutCompleted])

  const initFromActiveJobs = useCallback((activeJobs: ActiveJob[]) => {
    const runningImageNums = new Set(
      activeJobs
        .filter((j) => j.jobType === 'image_generation' && j.status === 'running' && j.pageNumber !== null)
        .map((j) => j.pageNumber as number),
    )
    if (runningImageNums.size > 0) setGeneratingPages(runningImageNums)
    if (activeJobs.some((j) => j.jobType === 'panel_layout' && j.status === 'running')) {
      setRegeneratingLayout(true)
    }
  }, [])

  async function startImageJob(pageNumber: number) {
    if (generatingPages.has(pageNumber)) return
    await episodePageApi.createImageJob(storyId, epId, pageNumber)
    setGeneratingPages((prev) => new Set([...prev, pageNumber]))
  }

  async function startLayoutJob() {
    await episodePageApi.createLayoutJob(storyId, epId)
    setRegeneratingLayout(true)
  }

  return {
    generatingPages,
    regeneratingLayout,
    lastUsedModel,
    lastImageModel,
    initFromActiveJobs,
    startImageJob,
    startLayoutJob,
  }
}
