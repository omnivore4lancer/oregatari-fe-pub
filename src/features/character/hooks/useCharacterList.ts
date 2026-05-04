import { useCallback, useEffect, useState } from 'react'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { useToast } from '../../../contexts/ToastContext'
import { characterApi, toCharacter, toCharacterDetail } from '../api/characterApi'
import type { Character, CharacterDetail } from '../types'
import type { CreateCharacterInput } from '../api/characterApi'

export function useCharacterList(storyId: number) {
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [protagonist, setProtagonist] = useState<Character | null>(null)
  const [subCharacters, setSubCharacters] = useState<Character[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<CharacterDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null)

  const loadList = useCallback(async () => {
    const list = await characterApi.getCharacters(storyId)
    const mapped = list.map(toCharacter)
    const proto = mapped.find((_, i) => list[i].isProtagonist) ?? null
    setProtagonist(proto)
    setSubCharacters(mapped.filter((_, i) => !list[i].isProtagonist))
    return proto
  }, [storyId])

  useEffect(() => {
    setListLoading(true)
    loadList()
      .then((proto) => { if (proto) setSelectedId(proto.id) })
      .catch(showError)
      .finally(() => setListLoading(false))
  }, [loadList, showError])

  useEffect(() => {
    if (selectedId == null) { setDetail(null); return }
    setDetailLoading(true)
    characterApi
      .getCharacter(storyId, selectedId)
      .then((r) => setDetail(toCharacterDetail(r)))
      .catch(showError)
      .finally(() => setDetailLoading(false))
  }, [storyId, selectedId, showError])

  async function handleFieldSave(updates: Partial<CreateCharacterInput>) {
    if (!selectedId) return
    try {
      const updated = await characterApi.updateCharacter(storyId, selectedId, updates)
      setDetail(toCharacterDetail(updated))
      if ('name' in updates || 'role' in updates) await loadList()
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
      const updated = await characterApi.getCharacter(storyId, selectedId)
      setDetail(toCharacterDetail(updated))
      await loadList()
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
      await loadList()
    } catch (e) {
      showError(e)
    } finally {
      setDeletingCharacter(null)
    }
  }

  return {
    protagonist,
    subCharacters,
    listLoading,
    selectedId,
    setSelectedId,
    detail,
    detailLoading,
    isGenerating,
    deletingCharacter,
    setDeletingCharacter,
    handleFieldSave,
    handleGenerateThreeView,
    handleDelete,
  }
}
