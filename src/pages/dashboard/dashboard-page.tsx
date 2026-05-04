import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { PlusIcon } from '../../components/Icons'
import { ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import type { StoryItem } from '../../features/dashboard'
import { StoryCard } from '../../features/dashboard'
import { storyApi } from '../../features/story'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'たった今'
  if (mins < 60) return `${mins}分前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}時間前`
  return `${Math.floor(hours / 24)}日前`
}

export default function DashboardPage() {
  const { showError } = useApiError()
  const { showToast } = useToast()
  const [stories, setStories] = useState<StoryItem[]>([])
  const [deleteTarget, setDeleteTarget] = useState<StoryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    storyApi
      .getStories()
      .then((data) => {
        setStories(
          data.map((s) => ({
            id: s.id,
            title: s.name,
            badge: s.genres[0]?.name ?? '',
            age: relativeTime(s.createdAt),
            coverImageUrl: s.coverImageUrl ?? null,
            previewImages: s.previewImages ?? [],
          })),
        )
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [showError])

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    try {
      await storyApi.deleteStory(deleteTarget.id)
      setStories((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      showToast('物語を削除しました')
    } catch (e) {
      showError(e)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tabs + action */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-200">
        <button className="px-3.5 py-1.5 rounded-md text-[13px] bg-gray-100 text-gray-800 font-semibold border-none cursor-default">
          漫画
        </button>
        <Link
          to="/stories/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-[13px] font-semibold no-underline hover:bg-purple-700 transition-colors"
        >
          <PlusIcon size={14} />
          新しい作品を登録
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="flex justify-center pt-20">
            <SpinnerDots size="md" />
          </div>
        ) : (
          <>
            <h2 className="text-[18px] font-bold text-gray-800 mb-4 m-0">今日</h2>
            {stories.length === 0 ? (
              <p className="text-[14px] text-gray-400">物語がありません。新しいワークスペースを作成してください。</p>
            ) : (
              <div className="flex flex-wrap gap-5">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} onDelete={setDeleteTarget} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="物語を削除しますか？"
        message={`「${deleteTarget?.title}」を削除します。この操作は取り消せません。`}
        confirmLabel="削除する"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
