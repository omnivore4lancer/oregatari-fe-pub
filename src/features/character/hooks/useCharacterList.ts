import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { useToast } from '../../../contexts/ToastContext'
import { jobApi, useJobPolling } from '../../jobs'
import { queryKeys } from '../../../lib/queryKeys'
import { useQueryWithError } from '../../../lib/useQueryWithError'
import { characterApi, toCharacter, toCharacterDetail } from '../api/characterApi'
import type { Character, CharacterDetail } from '../types'
import type { CreateCharacterInput } from '../api/characterApi'

export function useCharacterList(storyId: number) {
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null)

  const threeViewJobIdRef = useRef<string | null>(null)
  const threeViewCharIdRef = useRef<number | null>(null)
  const imageUrlBeforeRef = useRef<string | null>(null)

  const { isPolling: isGenerating, start: startThreeViewPolling } = useJobPolling<{
    id: string; status: 'RUNNING' | 'DONE' | 'FAILED'; errorMessage: string | null
  }>({
    poll: () => jobApi.getJob(threeViewJobIdRef.current!),
    isDone: (job) => job.status === 'DONE' || job.status === 'FAILED',
    onDone: async (job) => {
      const charId = threeViewCharIdRef.current
      if (charId) localStorage.removeItem(`three-view-job-${charId}`)
      if (job.status === 'FAILED') {
        showError(new Error(job.errorMessage ?? '三面図の生成に失敗しました'))
        return
      }
      // imageUrl が実際に更新されたか検証
      const updated = await characterApi.getCharacter(storyId, charId ?? 0)
      if (!updated.imageUrl || updated.imageUrl === imageUrlBeforeRef.current) {
        showError(new Error('三面図の生成に失敗しました。時間をおいて再試行してください。'))
        return
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.character(storyId, charId ?? 0) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
      showToast('三面図を生成しました')
    },
    onError: (e) => {
      const charId = threeViewCharIdRef.current
      if (charId) localStorage.removeItem(`three-view-job-${charId}`)
      showError(e)
    },
  })

  const listQuery = useQueryWithError({
    queryKey: queryKeys.characters(storyId),
    queryFn: () => characterApi.getCharacters(storyId),
  })

  const rawList = listQuery.data ?? []
  const protagonistRaw = rawList.find((r) => r.isProtagonist) ?? null
  const protagonistId = protagonistRaw?.id ?? null
  const protagonist = protagonistRaw ? toCharacter(protagonistRaw) : null
  const subCharacters = rawList.filter((r) => !r.isProtagonist).map(toCharacter)

  useEffect(() => {
    if (protagonistId !== null && selectedId === null) {
      setSelectedId(protagonistId)
    }
  }, [protagonistId, selectedId])

  // ページ再訪時に実行中ジョブを復元
  useEffect(() => {
    if (!selectedId) return
    const savedJobId = localStorage.getItem(`three-view-job-${selectedId}`)
    if (!savedJobId) return
    threeViewJobIdRef.current = savedJobId
    threeViewCharIdRef.current = selectedId
    startThreeViewPolling()
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const detailQuery = useQueryWithError({
    queryKey: queryKeys.character(storyId, selectedId ?? 0),
    queryFn: () => characterApi.getCharacter(storyId, selectedId!),
    enabled: selectedId != null,
  })

  const detail: CharacterDetail | null = detailQuery.data
    ? toCharacterDetail(detailQuery.data)
    : null

  async function handleFieldSave(updates: Partial<CreateCharacterInput>) {
    if (!selectedId) return
    try {
      const updated = await characterApi.updateCharacter(storyId, selectedId, updates)
      queryClient.setQueryData(queryKeys.character(storyId, selectedId), updated)
      if ('name' in updates || 'role' in updates) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
      }
      showToast('保存しました')
    } catch (e) {
      showError(e)
      throw e
    }
  }

  async function handleGenerateThreeView() {
    if (!selectedId) return
    try {
      imageUrlBeforeRef.current = detail?.imageUrl ?? null
      const { jobId } = await characterApi.generateThreeView(storyId, selectedId)
      localStorage.setItem(`three-view-job-${selectedId}`, jobId)
      threeViewJobIdRef.current = jobId
      threeViewCharIdRef.current = selectedId
      startThreeViewPolling()
    } catch (e) {
      showError(e)
    }
  }

  async function handleDelete() {
    if (!deletingCharacter) return
    try {
      await characterApi.deleteCharacter(storyId, deletingCharacter.id)
      showToast('キャラクターを削除しました')
      if (selectedId === deletingCharacter.id) setSelectedId(null)
      await queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
    } catch (e) {
      showError(e)
    } finally {
      setDeletingCharacter(null)
    }
  }

  return {
    protagonist,
    subCharacters,
    listLoading: listQuery.isLoading,
    selectedId,
    setSelectedId,
    detail,
    detailLoading: detailQuery.isLoading || detailQuery.isFetching,
    isGenerating,
    deletingCharacter,
    setDeletingCharacter,
    handleFieldSave,
    handleGenerateThreeView,
    handleDelete,
  }
}
