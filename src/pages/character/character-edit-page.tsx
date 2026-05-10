import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowLeftIcon, EditIcon, TrashIcon } from '../../components/Icons'
import { Button, CharacterAvatar, ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { DesignSection, InfoGrid } from '../../features/character'
import { characterApi, toCharacterDetail } from '../../features/character'
import { jobApi, useJobPolling } from '../../features/jobs'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

export default function CharacterEditPage() {
  const navigate = useNavigate()
  const { id, charId } = useParams()
  const storyId = Number(id)
  const characterId = Number(charId)
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const threeViewJobIdRef = useRef<string | null>(null)
  const imageUrlBeforeRef = useRef<string | null>(null)
  const { isPolling: isGenerating, start: startThreeViewPolling } = useJobPolling<{
    id: string; status: 'RUNNING' | 'DONE' | 'FAILED'; errorMessage: string | null
  }>({
    poll: () => jobApi.getJob(threeViewJobIdRef.current!),
    isDone: (job) => job.status === 'DONE' || job.status === 'FAILED',
    onDone: async (job) => {
      localStorage.removeItem(`three-view-job-${characterId}`)
      if (job.status === 'FAILED') {
        showError(new Error(job.errorMessage ?? '三面図の生成に失敗しました'))
        return
      }
      // imageUrl が実際に更新されたか検証
      const updated = await characterApi.getCharacter(storyId, characterId)
      if (!updated.imageUrl || updated.imageUrl === imageUrlBeforeRef.current) {
        showError(new Error('三面図の生成に失敗しました。時間をおいて再試行してください。'))
        return
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.character(storyId, characterId) })
      showToast('三面図を生成しました')
    },
    onError: (e) => {
      localStorage.removeItem(`three-view-job-${characterId}`)
      showError(e)
    },
  })

  // マウント時に実行中ジョブを復元
  useEffect(() => {
    const savedJobId = localStorage.getItem(`three-view-job-${characterId}`)
    if (!savedJobId) return
    threeViewJobIdRef.current = savedJobId
    startThreeViewPolling()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: character } = useQueryWithError({
    queryKey: queryKeys.character(storyId, characterId),
    queryFn: () => characterApi.getCharacter(storyId, characterId).then(toCharacterDetail),
  })

  async function handleDeleteConfirm() {
    try {
      await characterApi.deleteCharacter(storyId, characterId)
      queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
      showToast('キャラクターを削除しました')
      navigate(`/stories/${id}/characters`)
    } catch (e) {
      showError(e)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  async function handleGenerateThreeView() {
    try {
      imageUrlBeforeRef.current = character?.imageUrl ?? null
      const { jobId } = await characterApi.generateThreeView(storyId, characterId)
      localStorage.setItem(`three-view-job-${characterId}`, jobId)
      threeViewJobIdRef.current = jobId
      startThreeViewPolling()
    } catch (e) {
      showError(e)
    }
  }

  if (!character) return (
    <div className="flex-1 flex justify-center pt-32">
      <SpinnerDots size="md" />
    </div>
  )

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
        <button
          type="button"
          onClick={() => navigate(`/stories/${id}/characters`)}
          className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors cursor-pointer bg-transparent border-none p-1 shrink-0"
        >
          <ArrowLeftIcon size={16} />
        </button>

        <CharacterAvatar initials={character.initials} color={character.avatarColor} imageUrl={character.imageUrl} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[16px] text-[var(--text-h)]">{character.name}</span>
            <span className="text-[11px] text-[var(--text)] bg-gray-100 px-2 py-0.5 rounded-full">
              {character.role}
            </span>
          </div>
          <p className="text-[12px] text-[var(--text)] mt-0.5 m-0">
            {character.age} / {character.gender}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="flex items-center gap-1.5 text-[12px]"
            onClick={() => navigate(`/stories/${id}/characters/${charId}/edit`)}
          >
            <EditIcon size={11} />
            プロフィール編集
          </Button>
          <Button variant="primary" className="text-[12px]">
            見た目を整理
          </Button>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full">
        <DesignSection
          character={character}
          isGenerating={isGenerating}
          onGenerate={handleGenerateThreeView}
        />
        <InfoGrid character={character} />
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="キャラクターを削除"
        message={`「${character.name}」を削除しますか？この操作は取り消せません。`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}
