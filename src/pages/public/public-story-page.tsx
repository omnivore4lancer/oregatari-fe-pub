import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { PublicMangaViewer, publicStoryApi, type PublicEpisode } from '../../features/public-story'

function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-8">
        {/* ロゴ */}
        <Link to="/" className="no-underline shrink-0">
          <span className="text-[15px] font-black tracking-tight">
            <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-sm mr-0.5">ore</span>
            <span className="text-blue-500">gatari</span>
          </span>
        </Link>

        {/* ナビ */}
        {import.meta.env.DEV && (
          <nav className="flex items-center gap-6 text-[13px] text-gray-600">
            <span className="cursor-default hover:text-gray-900 transition-colors">作品をさがす</span>
            <span className="cursor-default hover:text-gray-900 transition-colors">新着</span>
            <span className="cursor-default hover:text-gray-900 transition-colors">ランキング</span>
          </nav>
        )}

        <div className="flex-1" />
        <a
          href="https://github.com/omnivore4lancer/oregatari-mastra-pub"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-black transition-colors"
          aria-label="GitHub"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  )
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`
}

function GenreChip({ name }: { name: string }) {
  return (
    <span className="inline-block border border-blue-400 text-blue-600 text-xs px-2 py-0.5 rounded-full">
      {name}
    </span>
  )
}

function EpisodeCard({ episode, onClick }: { episode: PublicEpisode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-1 text-left cursor-pointer bg-transparent border-0 p-0 group"
    >
      <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden">
        {episode.thumbnailUrl ? (
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs group-hover:bg-gray-200 transition-colors">
            No image
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">第{episode.number}話</p>
      <p className="text-xs font-medium text-gray-800 line-clamp-2">{episode.title}</p>
    </button>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-4xl font-bold text-gray-300 mb-4">404</p>
        <p className="text-gray-500">作品が見つかりませんでした</p>
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function PublicStoryPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const [viewingEpisode, setViewingEpisode] = useState<PublicEpisode | null>(null)

  const {
    data: story,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public-story', Number(storyId)],
    queryFn: () => publicStoryApi.getStory(Number(storyId!)),
    enabled: !!storyId,
    retry: false,
  })

  if (isLoading) return <Loading />
  if (isError || !story) return <NotFound />

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* 左列: カバー画像 + 公開日 */}
          <div className="w-48 sm:w-52 shrink-0 mx-auto sm:mx-0">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
              {story.coverImageUrl ? (
                <img
                  src={story.coverImageUrl}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No cover
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">最新話公開</span>
                <span>{formatDate(story.latestEpisodeCreatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">第1話公開</span>
                <span>{formatDate(story.firstEpisodeCreatedAt)}</span>
              </div>
            </div>
          </div>

          {/* 右列: タイトル + 作品情報 + エピソード一覧 */}
          <div className="flex-1 min-w-0">
            {/* ジャンルチップ */}
            <div className="flex gap-2 mb-3">
              {story.genres.map((g) => (
                <GenreChip key={g.id} name={g.name} />
              ))}
            </div>

            {/* タイトル */}
            <h1 className="text-sm font-bold text-gray-900 mb-2">{story.name}</h1>

            {/* 著者 */}
            {story.authorName && (
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                {story.authorName} 作
              </p>
            )}

            {/* あらすじ */}
            {story.description && (
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{story.description}</p>
            )}

            {/* タグ */}
            {story.tags.length > 0 && (
              <p className="text-xs text-blue-500 mb-6">
                {story.tags.map((t) => `#${t}`).join('　')}
              </p>
            )}

            <hr className="border-gray-200 mb-6" />

            {/* エピソード一覧 */}
            {story.episodes.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                公開中のエピソードはありません
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {story.episodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} onClick={() => setViewingEpisode(ep)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingEpisode && (
        <PublicMangaViewer
          episode={viewingEpisode}
          coverImageUrl={story.coverImageUrl}
          onClose={() => setViewingEpisode(null)}
        />
      )}
    </div>
  )
}
