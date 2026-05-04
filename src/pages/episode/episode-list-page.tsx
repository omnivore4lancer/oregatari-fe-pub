import { useEffect, useRef, useState } from 'react'
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

export default function EpisodeListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [deletingEpisode, setDeletingEpisode] = useState<Episode | null>(null)
  const [publishTarget, setPublishTarget] = useState<{ episode: Episode; action: 'publish' | 'unpublish' } | null>(null)
  const [polling, setPolling] = useState(() => !!(location.state as { backgroundGenerating?: boolean } | null)?.backgroundGenerating)
  const [loading, setLoading] = useState(true)
  const prevCountRef = useRef<number | null>(null)

  function handleComicEdit(ep: Episode) {
    navigate(`/stories/${id}/episodes/${ep.id}/scenes`)
  }

  async function handleDeleteConfirm() {
    if (!deletingEpisode) return
    try {
      await episodeApi.deleteEpisode(storyId, deletingEpisode.id)
      setEpisodes((prev) => prev.filter((e) => e.id !== deletingEpisode.id))
      if (selectedEpisode?.id === deletingEpisode.id) setSelectedEpisode(null)
      showToast('エピソードを削除しました')
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
      const updated = action === 'publish'
        ? await episodeApi.publishEpisode(storyId, episode.id)
        : await episodeApi.unpublishEpisode(storyId, episode.id)
      const updatedEpisode = toEpisode(updated)
      setEpisodes((prev) => prev.map((e) => e.id === episode.id ? updatedEpisode : e))
      if (selectedEpisode?.id === episode.id) setSelectedEpisode(updatedEpisode)
      showToast(action === 'publish' ? '公開しました' : '公開を取り下げました')
    } catch (e) {
      showError(e)
    } finally {
      setPublishTarget(null)
    }
  }

  useEffect(() => {
    episodeApi
      .getEpisodes(storyId)
      .then((list) => {
        const mapped = list.map(toEpisode)
        setEpisodes(mapped)
        if (mapped.length > 0) setSelectedEpisode(mapped[0])
        prevCountRef.current = mapped.length
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [storyId, showError])

  useEffect(() => {
    if (!polling) return
    const timer = setInterval(async () => {
      try {
        const list = await episodeApi.getEpisodes(storyId)
        const mapped = list.map(toEpisode)
        const hasGenerating = mapped.some((ep) => ep.generatingState === 'generating')
        const countIncreased = prevCountRef.current !== null && mapped.length > prevCountRef.current
        prevCountRef.current = mapped.length
        setEpisodes(mapped)
        if (countIncreased || !hasGenerating) {
          setPolling(false)
          if (countIncreased) showToast('エピソードの生成が完了しました')
        }
      } catch {
        // polling errors are silent
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [polling, storyId, showToast])

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
            {loading ? (
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
                  onClick={() => setSelectedEpisode(ep)}
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

      <PreviewPanel episode={selectedEpisode} />

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
