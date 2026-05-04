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
  EPISODE_TYPE,
  EPISODE_TYPE_LABEL,
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
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    Promise.all([episodeApi.getEpisodes(storyId), episodeApi.getEpisode(storyId, epId)])
      .then(([list, episode]) => {
        const mapped = list.map(toEpisode)
        const ep = toEpisode(episode)
        setAllEpisodes(mapped)
        setTitle(ep.title)
        setSummary(ep.description)
        setContent(ep.content)
        setSelectedType(
          ep.relation === EPISODE_TYPE.SEQUEL ? EPISODE_TYPE.SEQUEL : EPISODE_TYPE.STANDALONE,
        )
        if (ep.relation === EPISODE_TYPE.SEQUEL) {
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
        relation: selectedType === EPISODE_TYPE.SEQUEL ? 'SEQUEL' : 'STANDALONE',
        parentId: selectedType === EPISODE_TYPE.SEQUEL && parentEpisodeId ? parentEpisodeId : null,
        characterIds,
        inheritRelation: selectedType === EPISODE_TYPE.STANDALONE ? inheritRelation : undefined,
      })
      showToast('エピソードを保存しました')
      navigate(`/stories/${id}/episodes`)
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const showForm = selectedType === EPISODE_TYPE.STANDALONE || selectedType === EPISODE_TYPE.SEQUEL

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
          <div className="px-8 pt-4 pb-0">
            <StepNav currentStep={2} />

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-[0_2px_6px_rgba(168,85,247,0.3)] shrink-0">
                <svg
                  width="13"
                  height="13"
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
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[var(--text)] m-0 leading-tight">
                  第{allEpisodes.find((e) => e.id === epId)?.number}話
                </p>
                <p className="text-[13px] font-bold text-[var(--text-h)] m-0 mt-0.5 leading-tight truncate">{title}</p>
              </div>
              {showForm && (
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="flex items-center gap-1 text-[12px] text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <TrashIcon size={12} />
                    削除
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-3 py-1.5 text-[12px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <Button variant="primary" onClick={handleSave} disabled={submitting || !title.trim()}>
                    保存
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex border-b border-[var(--border)] px-8">
            {(['エピソード種別', '登場人物', '詳細'] as const).map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(i)}
                disabled={i > 0 && !showForm}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeTab === i
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 0 && (
              <>
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
                      title={EPISODE_TYPE_LABEL[EPISODE_TYPE.STANDALONE]}
                      description="新しい物語の起点。連続エピソードの第1話としても使用可能"
                      selected={selectedType === EPISODE_TYPE.STANDALONE}
                      onSelect={() => setSelectedType(EPISODE_TYPE.STANDALONE)}
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
                      title={EPISODE_TYPE_LABEL[EPISODE_TYPE.SEQUEL]}
                      description="既存の直接的な続き。時系列に連続する展開"
                      selected={selectedType === EPISODE_TYPE.SEQUEL}
                      onSelect={() => setSelectedType(EPISODE_TYPE.SEQUEL)}
                    />
                  </div>
                </div>

                {selectedType === EPISODE_TYPE.STANDALONE && (
                  <InheritRelationToggle checked={inheritRelation} onChange={setInheritRelation} />
                )}
                {selectedType === EPISODE_TYPE.SEQUEL && (
                  <SequelParentSection
                    episodes={allEpisodes.filter((e) => e.id !== epId)}
                    selectedId={parentEpisodeId}
                    onSelect={setParentEpisodeId}
                  />
                )}
              </>
            )}

            {activeTab === 1 && showForm && (
              <CharacterSelectSection
                characters={allCharacters}
                selectedIds={characterIds}
                onChange={setCharacterIds}
              />
            )}

            {activeTab === 2 && showForm && (
              <EpisodeDetailSection
                title={title}
                summary={summary}
                content={content}
                onTitleChange={setTitle}
                onSummaryChange={setSummary}
                onContentChange={setContent}
              />
            )}
          </div>

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
