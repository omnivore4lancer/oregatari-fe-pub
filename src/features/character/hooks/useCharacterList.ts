import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { useToast } from '../../../contexts/ToastContext'
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null)

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
    setIsGenerating(true)
    try {
      await characterApi.generateThreeView(storyId, selectedId)
      await queryClient.invalidateQueries({ queryKey: queryKeys.character(storyId, selectedId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
      showToast('三面図を生成しました')
    } catch (e) {
      showError(e)
    } finally {
      setIsGenerating(false)
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
