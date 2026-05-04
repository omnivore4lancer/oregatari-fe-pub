import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { PlusIcon } from '../../components/Icons'
import { Button, ConfirmDialog, DashedAddButton, PageHeader, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import {
  type Episode,
  EpisodeCard,
  FilterBar,
  type FilterTab,
  PreviewPanel,
} from '../../features/episode'
import { episodeApi, toEpisode } from '../../features/episode'
import { publishApi } from '../../features/publish'
import { queryKeys } from '../../lib/queryKeys'

export default function EpisodeListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null)
  const [deletingEpisode, setDeletingEpisode] = useState<Episode | null>(null)
  const [publishTarget, setPublishTarget] = useState<{ episode: Episode; action: 'publish' | 'unpublish' } | null>(null)
  const [polling, setPolling] = useState(
    () => !!(location.state as { backgroundGenerating?: boolean } | null)?.backgroundGenerating,
  )
  const prevCountRef = useRef<number | null>(null)

  const { data: episodes = [], isLoading, error } = useQuery({
    queryKey: queryKeys.episodes(storyId),
    queryFn: () => episodeApi.getEpisodes(storyId).then((list) => list.map(toEpisode)),
    refetchInterval: polling ? 5000 : false,
    refetchIntervalInBackground: false,
  })

  // ポーリング中のエラーは無視し、初回ロード失敗時のみ表示
  useEffect(() => {
    if (error && episodes.length === 0) showError(error)
  }, [error, episodes.length, showError])

  // 初回データロード時に先頭を選択
  useEffect(() => {
    if (episodes.length > 0 && selectedEpisodeId === null) {
      setSelectedEpisodeId(episodes[0].id)
    }
  }, [episodes, selectedEpisodeId])

  // バックグラウンド生成の完了検出
  useEffect(() => {
    if (!polling || episodes.length === 0) return
    const hasGenerating = episodes.some((ep) => ep.generatingState === 'generating')
    const countIncreased = prevCountRef.current !== null && episodes.length > prevCountRef.current
    prevCountRef.current = episodes.length
    if (countIncreased || !hasGenerating) {
      setPolling(false)
      if (countIncreased) showToast('エピソードの生成が完了しました')
    }
  }, [episodes, polling, showToast])

  const selectedEpisode = episodes.find((ep) => ep.id === selectedEpisodeId) ?? null

  function handleComicEdit(ep: Episode) {
    navigate(`/stories/${id}/episodes/${ep.id}/scenes`)
  }

  async function handleDeleteConfirm() {
    if (!deletingEpisode) return
    try {
      await episodeApi.deleteEpisode(storyId, deletingEpisode.id)
      if (selectedEpisodeId === deletingEpisode.id) setSelectedEpisodeId(null)
      showToast('エピソードを削除しました')
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes(storyId) })
    } catch (e) {
      showError(e)
    } finally {
      setDeletingEpisode(null)
    }
  }

  async function handlePublishConfirm() {
    if (!publishTarget) return
    const { episode, action } = publishTarget
    try {
      await (action === 'publish'
        ? episodeApi.publishEpisode(storyId, episode.id)
        : episodeApi.unpublishEpisode(storyId, episode.id))

      if (action === 'publish') {
        const settings = await publishApi.getPublishSettings(storyId)
        if (!settings?.publishedAt) {
          await publishApi.publishStory(storyId)
          showToast('エピソードを公開し、ストーリーも公開しました')
        } else {
          showToast('公開しました')
        }
      } else {
        showToast('公開を取り下げました')
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes(storyId) })
    } catch (e) {
      showError(e)
    } finally {
      setPublishTarget(null)
    }
  }

  const filtered =
    activeFilter === 'all'
      ? episodes
      : episodes.filter((ep) => ep.status === activeFilter || ep.relation === activeFilter)

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6">
          <PageHeader
            title="エピソード一覧"
            titleExtra={
              <span className="text-[12px] text-[var(--text)] bg-gray-100 px-2 py-0.5 rounded-full">
                全{episodes.length}話
              </span>
            }
            actions={
              <Button
                variant="primary"
                onClick={() => navigate(`/stories/${id}/episodes/new`)}
              >
                <span className="flex items-center gap-1.5">
                  <PlusIcon size={13} />
                  新規エピソード
                </span>
              </Button>
            }
          />

          {polling && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-[12px] text-blue-700">
              <SpinnerDots size="sm" />
              バックグラウンドでエピソードを生成中です。完了すると自動で反映されます。
            </div>
          )}

          <div className="mb-4">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex justify-center pt-32">
                <SpinnerDots size="md" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-[13px] text-[var(--text)] py-8 text-center">
                該当するエピソードがありません
              </p>
            ) : (
              filtered.map((ep) => (
                <button
                  key={ep.id}
                  type="button"
                  className="text-left w-full"
                  onClick={() => setSelectedEpisodeId(ep.id)}
                >
                  <EpisodeCard
                    episode={ep}
                    onEdit={() => navigate(`/stories/${id}/episodes/${ep.id}/edit`)}
                    onComicEdit={() => handleComicEdit(ep)}
                    onDelete={() => setDeletingEpisode(ep)}
                    onPublish={() => setPublishTarget({ episode: ep, action: 'publish' })}
                    onUnpublish={() => setPublishTarget({ episode: ep, action: 'unpublish' })}
                  />
                </button>
              ))
            )}
          </div>

          <div className="mt-3">
            <DashedAddButton
              label="新規エピソードを追加"
              onClick={() => navigate(`/stories/${id}/episodes/new`)}
            />
          </div>
        </div>
      </div>

      <PreviewPanel
        episode={selectedEpisode}
        onViewManga={
          selectedEpisode?.hasScenes
            ? () => navigate(`/stories/${id}/episodes/${selectedEpisode.id}/viewer`)
            : undefined
        }
      />

      <ConfirmDialog
        open={!!deletingEpisode}
        title="エピソードを削除"
        message={`「${deletingEpisode?.title}」を削除しますか？この操作は取り消せません。`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEpisode(null)}
      />

      <ConfirmDialog
        open={publishTarget?.action === 'publish'}
        title="エピソードを公開しますか？"
        message={`「${publishTarget?.episode.title}」を公開します。`}
        confirmLabel="公開する"
        confirmVariant="primary"
        onConfirm={handlePublishConfirm}
        onCancel={() => setPublishTarget(null)}
      />

      <ConfirmDialog
        open={publishTarget?.action === 'unpublish'}
        title="公開を取り下げますか？"
        message={`「${publishTarget?.episode.title}」の公開を取り下げます。`}
        confirmLabel="取り下げる"
        confirmVariant="danger"
        onConfirm={handlePublishConfirm}
        onCancel={() => setPublishTarget(null)}
      />
    </div>
  )
}
