import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { useCharacters } from '../../features/character'
import { useJobPolling } from '../../features/jobs'
import { CoverImagePreview, publishApi, PublishCoverSettings } from '../../features/publish'

export default function PublishSettingsPage() {
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const characters = useCharacters(storyId)
  const [selectedCharIds, setSelectedCharIds] = useState<number[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const coverJobIdRef = useRef<string | null>(null)

  const { isPolling: isGeneratingCover, start: startCoverPolling } = useJobPolling<{ id: string; status: 'RUNNING' | 'DONE' | 'FAILED'; errorMessage: string | null }>({
    poll: () => publishApi.getJobStatus(coverJobIdRef.current!),
    isDone: (job) => job.status === 'DONE' || job.status === 'FAILED',
    onDone: async (job) => {
      if (job.status === 'FAILED') {
        showError(new Error(job.errorMessage ?? '表紙画像の生成に失敗しました'))
      } else {
        const updated = await publishApi.getPublishSettings(storyId)
        setCoverImageUrl(updated?.coverImageUrl ?? null)
      }
    },
    onError: showError,
  })

  useEffect(() => {
    publishApi
      .getPublishSettings(storyId)
      .then((settings) => {
        if (!settings) return
        setSelectedCharIds(settings.characterIds)
        setSelectedStyle(settings.visualStyle ?? null)
        setSelectedLayout(settings.layout ?? null)
        setDescription(settings.description ?? '')
        setCoverImageUrl(settings.coverImageUrl ?? null)
        setPublishedAt(settings.publishedAt ?? null)
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [storyId, showError])

  async function handleGenerateCoverImage() {
    if (isGeneratingCover || selectedCharIds.length === 0) return
    try {
      await publishApi.upsertPublishSettings(storyId, {
        characterIds: selectedCharIds,
        visualStyle: selectedStyle ?? undefined,
        layout: selectedLayout ?? undefined,
        description: description || undefined,
      })
      const { jobId } = await publishApi.generateCoverImageJob(storyId)
      coverJobIdRef.current = jobId
      startCoverPolling()
    } catch (e) {
      showError(e)
    }
  }

  async function handleSave() {
    try {
      await publishApi.upsertPublishSettings(storyId, {
        characterIds: selectedCharIds,
        visualStyle: selectedStyle ?? undefined,
        layout: selectedLayout ?? undefined,
        description: description || undefined,
      })
      showToast('設定を保存しました')
    } catch (e) {
      showError(e)
    }
  }

  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<'publish' | 'unpublish' | null>(null)

  async function handlePublish() {
    setConfirmDialog(null)
    setIsPublishing(true)
    try {
      const result = await publishApi.publishStory(storyId)
      setPublishedAt(result.publishedAt)
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
      const result = await publishApi.unpublishStory(storyId)
      setPublishedAt(result.publishedAt)
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

  if (loading) return (
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
        publishedAt={publishedAt}
        isPublishing={isPublishing}
        onPublish={() => setConfirmDialog('publish')}
        onUnpublish={() => setConfirmDialog('unpublish')}
      />

      <CoverImagePreview isGenerating={isGeneratingCover} imageUrl={coverImageUrl} />

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
