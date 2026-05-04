import { ComicIcon, EditIcon, TrashIcon } from '../../../../components/Icons'
import { Button, SpinnerDots, StatusBadge } from '../../../../components/ui'
import type { Episode } from '../../types'

interface EpisodeCardProps {
  episode: Episode
  onEdit?: () => void
  onComicEdit?: () => void
  onDelete?: () => void
}

export function EpisodeCard({ episode, onEdit, onComicEdit, onDelete }: EpisodeCardProps) {
  const isGenerating = episode.generatingState === 'generating'

  return (
    <div className={`bg-[var(--bg)] rounded-lg overflow-hidden transition-colors hover:border-[var(--accent-border)] ${episode.hasScenes ? 'border-2 border-[var(--border)]' : 'border border-[var(--border)]'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] text-[var(--text)] shrink-0">#{episode.number}</span>
            <span className="font-bold text-[14px] text-[var(--text-h)] truncate">
              {episode.title}
            </span>
            <StatusBadge
              label={episode.status}
              variant={episode.status === '公開中' ? 'success' : 'default'}
            />
          </div>
          <Button variant="primary" className="shrink-0 !py-1 text-[12px]">
            公開
          </Button>
        </div>

        <p className="text-[12px] text-[var(--text)] leading-relaxed line-clamp-2 mb-3">
          {episode.description}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-[var(--text)]">
          <span className="flex items-center gap-1 text-[var(--accent)]">
            {isGenerating ? (
              <>
                <SpinnerDots size="sm" />
                エピソード生成中...
              </>
            ) : (
              '生成済み'
            )}
          </span>
          <span className="text-[var(--border)]">|</span>
          <span>作成: {episode.createdAt}</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit?.() }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-sky-200 bg-sky-50 text-[11px] font-medium text-sky-700 hover:bg-sky-100 hover:border-sky-300 transition-colors cursor-pointer"
            >
              <EditIcon size={11} />
              シナリオ編集
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onComicEdit?.() }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-violet-300 bg-violet-50 text-[11px] font-medium text-violet-700 hover:bg-violet-100 hover:border-violet-400 transition-colors cursor-pointer"
            >
              <ComicIcon size={11} />
              マンガ編集
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.() }}
              className="p-1 rounded text-[var(--text)] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <TrashIcon size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
