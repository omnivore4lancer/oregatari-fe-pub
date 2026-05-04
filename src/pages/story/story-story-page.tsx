import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { Button, SectionCard, SpinnerDots, textareaClass } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { EditingActions, storyApi, StorySectionBlock } from '../../features/story'
import type { SectionKey } from '../../features/story'

type StorySections = { intro: string; dev: string; climax: string; conclusion: string }

function StoryEditTabs({ storyId }: { storyId: number }) {
  const { pathname } = useLocation()
  const base = `/stories/${storyId}`
  return (
    <div className="flex border-b border-[var(--border)] bg-[var(--bg)] px-5 gap-1">
      {[
        { label: 'ストーリー', path: `${base}/story` },
        { label: '相関図', path: `${base}/cast` },
      ].map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-4 py-2.5 text-[13px] font-medium no-underline border-b-2 transition-colors ${
            pathname === tab.path
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

export default function StoryStoryPage() {
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [editingSection, setEditingSection] = useState<SectionKey | null>(null)
  const [activeStoryTab, setActiveStoryTab] = useState(0)
  const [eraBg, setEraBg] = useState('')
  const [eraDraft, setEraDraft] = useState('')
  const [story, setStory] = useState<StorySections>({ intro: '', dev: '', climax: '', conclusion: '' })
  const [storyDraft, setStoryDraft] = useState<StorySections>({ intro: '', dev: '', climax: '', conclusion: '' })
  const [generating, setGenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [loading, setLoading] = useState(true)
  const streamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    storyApi
      .getStory(storyId)
      .then((s) => {
        const bg = s.eraBg ?? ''
        setEraBg(bg)
        setEraDraft(bg)
        const sections = {
          intro: s.intro ?? '',
          dev: s.dev ?? '',
          climax: s.climax ?? '',
          conclusion: s.conclusion ?? '',
        }
        setStory(sections)
        setStoryDraft(sections)
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [storyId, showError])

  function startEdit(section: SectionKey) {
    if (section === 'era') setEraDraft(eraBg)
    if (section === 'story') setStoryDraft(story)
    setEditingSection(section)
  }

  async function commitEdit(section: SectionKey) {
    try {
      if (section === 'era') {
        setEraBg(eraDraft)
        await storyApi.updateStory(storyId, { eraBg: eraDraft })
      }
      if (section === 'story') {
        setStory(storyDraft)
        await storyApi.updateStory(storyId, storyDraft)
      }
      showToast('保存しました')
    } catch (e) {
      showError(e)
    }
    setEditingSection(null)
  }

  async function handleGenerate() {
    setGenerating(true)
    setStreamText('')
    try {
      await storyApi.generateStory(storyId, (text) => {
        setStreamText((prev) => {
          const next = prev + text
          setTimeout(() => {
            if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight
          }, 0)
          return next
        })
      })
      const s = await storyApi.getStory(storyId)
      setEraBg(s.eraBg ?? '')
      setEraDraft(s.eraBg ?? '')
      const sections = {
        intro: s.intro ?? '',
        dev: s.dev ?? '',
        climax: s.climax ?? '',
        conclusion: s.conclusion ?? '',
      }
      setStory(sections)
      setStoryDraft(sections)
      showToast('ストーリーを生成しました')
    } catch (e) {
      showError(e)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return (
    <>
      <StoryEditTabs storyId={storyId} />
      <div className="flex-1 flex justify-center pt-32">
        <SpinnerDots size="md" />
      </div>
    </>
  )

  return (
    <>
      <StoryEditTabs storyId={storyId} />
      <div className="flex gap-4 p-5 items-stretch">
        <div className="flex-1 min-w-0">
          <SectionCard
            title="時代背景"
            className="h-full"
            headerActions={
              <EditingActions
                editing={editingSection === 'era'}
                onEdit={() => startEdit('era')}
                onDone={() => commitEdit('era')}
                onCancel={() => setEditingSection(null)}
              />
            }
          >
            {editingSection === 'era' ? (
              <textarea
                className={`${textareaClass} min-h-[120px]`}
                value={eraDraft}
                onChange={(e) => setEraDraft(e.target.value)}
              />
            ) : (
              <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
                {eraBg || '（未設定）'}
              </p>
            )}
          </SectionCard>
        </div>

        <div className="flex-[2] min-w-0">
          <SectionCard
            title="歴史ストーリー"
            className="h-full"
            headerActions={
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={generating || editingSection !== null}
                >
                  {generating ? <SpinnerDots /> : 'AI 生成'}
                </Button>
                <EditingActions
                  editing={editingSection === 'story'}
                  onEdit={() => startEdit('story')}
                  onDone={() => commitEdit('story')}
                  onCancel={() => setEditingSection(null)}
                />
              </div>
            }
          >
            <>
              <div className="flex border-b border-[var(--border)] mb-4">
                {(['導入', '展開', 'クライマックス', '結末'] as const).map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveStoryTab(i)}
                    className={`px-4 py-2.5 text-[12px] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                      activeStoryTab === i
                        ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                        : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {editingSection === 'story' ? (
                <textarea
                  className={`${textareaClass} min-h-[100px]`}
                  value={storyDraft[(['intro', 'dev', 'climax', 'conclusion'] as const)[activeStoryTab]]}
                  onChange={(e) => {
                    const key = (['intro', 'dev', 'climax', 'conclusion'] as const)[activeStoryTab]
                    setStoryDraft((prev) => ({ ...prev, [key]: e.target.value }))
                  }}
                />
              ) : (
                <StorySectionBlock
                  tag={['導入', '展開', 'クライマックス', '結末'][activeStoryTab]}
                  content={[story.intro, story.dev, story.climax, story.conclusion][activeStoryTab] || '（未設定）'}
                />
              )}
            </>
          </SectionCard>
        </div>

      </div>

      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg)] rounded-xl shadow-2xl w-[640px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--text-h)] font-semibold text-[14px]">
                <SpinnerDots />
                ストーリー生成中...
              </div>
            </div>
            <div
              ref={streamRef}
              className="flex-1 overflow-y-auto p-5 text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap"
            >
              {streamText}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
