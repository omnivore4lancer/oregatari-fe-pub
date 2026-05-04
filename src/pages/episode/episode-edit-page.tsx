import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowLeftIcon, SparkleIcon, TrashIcon } from '../../components/Icons'
import { Button, ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { useCharacters } from '../../features/character'
import {
  AiPanel,
  CharacterSelectSection,
  type Episode,
  EpisodeDetailSection,
  type EpisodeType,
  EpisodeTypeCard,
  InheritRelationToggle,
  SequelParentSection,
  StepNav,
} from '../../features/episode'
import { episodeApi, toEpisode } from '../../features/episode'

export default function EpisodeEditPage() {
  const navigate = useNavigate()
  const { id, episodeId } = useParams()
  const storyId = Number(id)
  const epId = Number(episodeId)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([])
  const allCharacters = useCharacters(storyId)

  const [selectedType, setSelectedType] = useState<EpisodeType>(null)
  const [inheritRelation, setInheritRelation] = useState(true)
  const [parentEpisodeId, setParentEpisodeId] = useState<number | null>(null)
  const [characterIds, setCharacterIds] = useState<number[]>([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    Promise.all([episodeApi.getEpisodes(storyId), episodeApi.getEpisode(storyId, epId)])
      .then(([list, episode]) => {
        const mapped = list.map(toEpisode)
        const ep = toEpisode(episode)
        setAllEpisodes(mapped)
        setTitle(ep.title)
        setSummary(ep.description)
        setContent(ep.content)
        setSelectedType(ep.relation === '続編' ? '続編' : '独立')
        if (ep.relation === '続編') {
          setParentEpisodeId(episode.parentId)
        }
        setCharacterIds(ep.characterIds)
        setInheritRelation(ep.inheritRelation)
        setLoaded(true)
      })
      .catch(showError)
  }, [storyId, epId, showError])

  function handleBack() {
    navigate(`/stories/${id}/episodes`)
  }

  async function handleDeleteConfirm() {
    try {
      await episodeApi.deleteEpisode(storyId, epId)
      showToast('エピソードを削除しました')
      navigate(`/stories/${id}/episodes`)
    } catch (e) {
      showError(e)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  async function handleSave() {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await episodeApi.updateEpisode(storyId, epId, {
        title: title.trim(),
        description: summary.trim() || undefined,
        content: content.trim() || undefined,
        relation: selectedType === '続編' ? 'SEQUEL' : 'STANDALONE',
        parentId: selectedType === '続編' && parentEpisodeId ? parentEpisodeId : null,
        characterIds,
        inheritRelation: selectedType === '独立' ? inheritRelation : undefined,
      })
      showToast('エピソードを保存しました')
      navigate(`/stories/${id}/episodes`)
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const showForm = selectedType === '独立' || selectedType === '続編'

  return (
    <div className="flex h-full">
      {/* Left: episode list sidebar - always visible */}
      <div className="w-44 shrink-0 flex flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg)]">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-50 transition-colors cursor-pointer border-0 border-b border-[var(--border)] bg-transparent w-full shrink-0"
        >
          <ArrowLeftIcon size={13} />
          エピソード一覧
        </button>
        <div className="flex-1 overflow-y-auto">
          {allEpisodes.map((ep) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => navigate(`/stories/${id}/episodes/${ep.id}/edit`)}
              className={`w-full text-left px-3 py-2.5 text-[12px] cursor-pointer border-0 bg-transparent transition-colors ${
                ep.id === epId
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-[var(--text)] hover:bg-gray-50 hover:text-[var(--text-h)]'
              }`}
            >
              <span className="text-[10px] opacity-60 block mb-0.5">第{ep.number}話</span>
              <span className="truncate block">{ep.title}</span>
            </button>
          ))}
        </div>
      </div>

      {!loaded ? (
        <div className="flex-1 flex justify-center pt-32">
          <SpinnerDots size="md" />
        </div>
      ) : (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-8">
          <StepNav currentStep={2} />

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-[0_2px_8px_rgba(168,85,247,0.35)] shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text)] m-0 leading-tight">
                  第{allEpisodes.find((e) => e.id === epId)?.number}話
                </p>
                <h1 className="text-[15px] font-bold text-[var(--text-h)] m-0 mt-0.5 leading-tight">
                  {title}
                </h1>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <SparkleIcon size={15} />
              <h2 className="text-[15px] font-semibold text-[var(--text-h)] m-0">
                エピソードの種類を選択
              </h2>
            </div>

            <div className="flex gap-4">
              <EpisodeTypeCard
                icon={
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                }
                title="独立"
                description="新しい物語の起点。連続エピソードの第1話としても使用可能"
                selected={selectedType === '独立'}
                onSelect={() => setSelectedType('独立')}
              />
              <EpisodeTypeCard
                icon={
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-[0_2px_6px_rgba(168,85,247,0.35)]">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                }
                title="続編"
                description="既存の直接的な続き。時系列に連続する展開"
                selected={selectedType === '続編'}
                onSelect={() => setSelectedType('続編')}
              />
            </div>
          </div>

          {selectedType === '独立' && (
            <InheritRelationToggle checked={inheritRelation} onChange={setInheritRelation} />
          )}

          {selectedType === '続編' && (
            <SequelParentSection
              episodes={allEpisodes.filter((e) => e.id !== epId)}
              selectedId={parentEpisodeId}
              onSelect={setParentEpisodeId}
            />
          )}

          {showForm && (
            <>
              <CharacterSelectSection
                characters={allCharacters}
                selectedIds={characterIds}
                onChange={setCharacterIds}
              />
              <EpisodeDetailSection
                title={title}
                summary={summary}
                content={content}
                onTitleChange={setTitle}
                onSummaryChange={setSummary}
                onContentChange={setContent}
              />
            </>
          )}
        </div>

        {showForm && (
          <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-8 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-1.5 text-[13px] text-red-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <TrashIcon size={13} />
              削除
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <Button variant="primary" onClick={handleSave} disabled={submitting || !title.trim()}>
                保存
              </Button>
            </div>
          </div>
        )}
      </div>
      )}

      <AiPanel />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="エピソードを削除"
        message={`「${title}」を削除しますか？この操作は取り消せません。`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}
