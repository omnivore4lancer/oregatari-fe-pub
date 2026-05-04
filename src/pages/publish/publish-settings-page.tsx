import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { Button, ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { useCharacters } from '../../features/character'
import { useJobPolling } from '../../features/jobs'
import { CoverImagePreview, publishApi, PublishCoverSettings } from '../../features/publish'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

export default function PublishSettingsPage() {
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const characters = useCharacters(storyId)

  const { data, isLoading } = useQueryWithError({
    queryKey: queryKeys.publishSettings(storyId),
    queryFn: () => publishApi.getPublishSettings(storyId),
    staleTime: 0,
  })

  // フォームフィールド：初回データ到着時のみ初期化する
  const [initialized, setInitialized] = useState(false)
  const [selectedCharIds, setSelectedCharIds] = useState<number[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!data || initialized) return
    setSelectedCharIds(data.characterIds)
    setSelectedStyle(data.visualStyle ?? null)
    setSelectedLayout(data.layout ?? null)
    setDescription(data.description ?? '')
    setInitialized(true)
  }, [data, initialized])

  // 表示のみの値はクエリデータから派生させる
  const coverImageUrl = data?.coverImageUrl ?? null
  const publishedAt = data?.publishedAt ?? null

  const coverJobIdRef = useRef<string | null>(null)

  const { isPolling: isGeneratingCover, start: startCoverPolling } = useJobPolling<{
    id: string
    status: 'RUNNING' | 'DONE' | 'FAILED'
    errorMessage: string | null
  }>({
    poll: () => publishApi.getJobStatus(coverJobIdRef.current!),
    isDone: (job) => job.status === 'DONE' || job.status === 'FAILED',
    onDone: async (job) => {
      if (job.status === 'FAILED') {
        showError(new Error(job.errorMessage ?? '表紙画像の生成に失敗しました'))
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.publishSettings(storyId) })
      }
    },
    onError: showError,
  })

  async function handleGenerateCoverImage() {
    if (isGeneratingCover || selectedCharIds.length === 0) return
    try {
      const updated = await publishApi.upsertPublishSettings(storyId, {
        characterIds: selectedCharIds,
        visualStyle: selectedStyle ?? undefined,
        layout: selectedLayout ?? undefined,
        description: description || undefined,
      })
      queryClient.setQueryData(queryKeys.publishSettings(storyId), updated)
      const { jobId } = await publishApi.generateCoverImageJob(storyId)
      coverJobIdRef.current = jobId
      startCoverPolling()
    } catch (e) {
      showError(e)
    }
  }

  async function handleSave() {
    try {
      const updated = await publishApi.upsertPublishSettings(storyId, {
        characterIds: selectedCharIds,
        visualStyle: selectedStyle ?? undefined,
        layout: selectedLayout ?? undefined,
        description: description || undefined,
      })
      queryClient.setQueryData(queryKeys.publishSettings(storyId), updated)
      showToast('設定を保存しました')
    } catch (e) {
      showError(e)
    }
  }

  const [isPublishing, setIsPublishing] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<'publish' | 'unpublish' | null>(null)

  async function handlePublish() {
    setConfirmDialog(null)
    setIsPublishing(true)
    try {
      await publishApi.publishStory(storyId)
      queryClient.invalidateQueries({ queryKey: queryKeys.publishSettings(storyId) })
      showToast('ストーリーを公開しました')
    } catch (e) {
      showError(e)
    } finally {
      setIsPublishing(false)
    }
  }

  async function handleUnpublish() {
    setConfirmDialog(null)
    setIsPublishing(true)
    try {
      await publishApi.unpublishStory(storyId)
      queryClient.invalidateQueries({ queryKey: queryKeys.publishSettings(storyId) })
      showToast('公開を取り下げました')
    } catch (e) {
      showError(e)
    } finally {
      setIsPublishing(false)
    }
  }

  const [activeTab, setActiveTab] = useState(0)

  const completedSteps = [
    selectedCharIds.length > 0,
    selectedStyle !== null,
    selectedLayout !== null,
    description.length > 0,
  ].filter(Boolean).length

  if (isLoading) return (
    <div className="flex-1 flex justify-center pt-32">
      <SpinnerDots size="md" />
    </div>
  )

  return (
    <div className="p-6 grid grid-cols-[3fr_2fr] gap-6 items-start">
      <PublishCoverSettings
        characters={characters}
        selectedCharIds={selectedCharIds}
        onToggleChar={(id) => setSelectedCharIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
        description={description}
        onDescriptionChange={setDescription}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedSteps={completedSteps}
        isGeneratingCover={isGeneratingCover}
        onGenerateCoverImage={handleGenerateCoverImage}
        onSave={handleSave}
      />

      <CoverImagePreview
        isGenerating={isGeneratingCover}
        imageUrl={coverImageUrl}
        headerActions={
          publishedAt ? (
            <Button
              className="text-[12px] border-red-300 text-red-600 hover:border-red-400"
              onClick={() => setConfirmDialog('unpublish')}
              disabled={isPublishing}
            >
              {isPublishing ? '処理中...' : '公開取り下げ'}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="text-[12px]"
              onClick={() => setConfirmDialog('publish')}
              disabled={isPublishing}
            >
              {isPublishing ? '処理中...' : '公開する'}
            </Button>
          )
        }
      />

      <ConfirmDialog
        open={confirmDialog === 'publish'}
        title="ストーリーを公開しますか？"
        message="公開すると、ストーリーが一般に公開されます。設定はいつでも変更できます。"
        confirmLabel="公開する"
        confirmVariant="primary"
        onConfirm={handlePublish}
        onCancel={() => setConfirmDialog(null)}
      />
      <ConfirmDialog
        open={confirmDialog === 'unpublish'}
        title="公開を取り下げますか？"
        message="公開を取り下げると、ストーリーが非公開になります。"
        confirmLabel="取り下げる"
        confirmVariant="danger"
        onConfirm={handleUnpublish}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  )
}
