import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowLeftIcon, SparkleIcon } from '../../components/Icons'
import { Button } from '../../components/ui'
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

type StreamingState = 'idle' | 'streaming' | 'done'

export default function EpisodeCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [episodes, setEpisodes] = useState<Episode[]>([])
  const allCharacters = useCharacters(storyId)

  const [selectedType, setSelectedType] = useState<EpisodeType>(null)
  const [inheritRelation, setInheritRelation] = useState(true)
  const [parentEpisodeId, setParentEpisodeId] = useState<number | null>(null)
  const [characterIds, setCharacterIds] = useState<number[]>([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [streamingState, setStreamingState] = useState<StreamingState>('idle')
  const [streamingText, setStreamingText] = useState('')

  useEffect(() => {
    episodeApi
      .getEpisodes(storyId)
      .then((list) => {
        const mapped = list.map(toEpisode)
        setEpisodes(mapped)
        if (mapped.length > 0) setParentEpisodeId(mapped[0].id)
      })
      .catch(showError)
  }, [storyId, showError])

  function handleBack() {
    navigate(`/stories/${id}/episodes`)
  }

  function buildGenerateInput() {
    return {
      relation: (selectedType === '続編' ? 'SEQUEL' : 'STANDALONE') as 'SEQUEL' | 'STANDALONE',
      parentId: selectedType === '続編' && parentEpisodeId ? parentEpisodeId : undefined,
      characterIds,
      inheritRelation: selectedType === '独立' ? inheritRelation : undefined,
      titleHint: title.trim() || undefined,
      summaryHint: summary.trim() || undefined,
    }
  }

  async function handleGenerateStream() {
    setSubmitting(true)
    setStreamingText('')
    setStreamingState('streaming')
    try {
      await episodeApi.streamCreate(
        storyId,
        buildGenerateInput(),
        (text) => setStreamingText((prev) => prev + text),
        (text) => setStreamingText(text),
      )
      setStreamingState('done')
    } catch (e) {
      showError(e)
      setStreamingState('idle')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGenerateBackground() {
    setSubmitting(true)
    try {
      await episodeApi.generateBackground(storyId, buildGenerateInput())
      showToast('バックグラウンドでエピソードを生成しています')
      navigate(`/stories/${id}/episodes`, { state: { backgroundGenerating: true } })
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const showForm = selectedType === '独立' || selectedType === '続編'

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {streamingState !== 'idle' ? (
          <>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-[0_2px_6px_rgba(168,85,247,0.35)] shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h2 className="text-[16px] font-bold text-[var(--text-h)] m-0">
                  {streamingState === 'streaming' ? 'エピソード生成中...' : '生成完了'}
                </h2>
              </div>
              <div className="bg-[#f7f6f3] rounded-xl border border-[var(--border)] p-6 whitespace-pre-wrap text-[13px] text-[var(--text)] leading-relaxed min-h-[200px]">
                {streamingText || (streamingState === 'streaming' ? '▌' : '')}
              </div>
            </div>
            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-8 py-4 flex items-center justify-end gap-3">
              {streamingState === 'done' ? (
                <Button variant="primary" onClick={handleBack}>
                  エピソード一覧へ
                </Button>
              ) : (
                <Button variant="primary" disabled>
                  生成中...
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-8">
              <StepNav currentStep={selectedType === null ? 0 : 1} />

              <div className="flex items-start gap-3 mb-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-0.5 p-1 rounded text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeftIcon size={16} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-[0_2px_8px_rgba(168,85,247,0.35)] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
                    <h1 className="text-[18px] font-bold text-[var(--text-h)] m-0 leading-tight">
                      新規エピソード作成
                    </h1>
                    <p className="text-[13px] text-[var(--text)] mt-1 m-0">
                      右のAI編集者と相談しながら作成できます
                    </p>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
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
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
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
                  episodes={episodes}
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
              <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-8 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <Button variant="primary" onClick={handleGenerateStream} disabled={submitting}>
                  ストリームで生成
                </Button>
                <Button variant="primary" onClick={handleGenerateBackground} disabled={submitting}>
                  バックグラウンドで生成
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AiPanel />
    </div>
  )
}
