import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowLeftIcon, RefreshIcon } from '../../components/Icons'
import { Button, ConfirmDialog, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import {
  episodeApi,
  episodePageApi,
  PagePreview,
  PanelDetailModal,
  SceneRightPanel,
  useSceneJobs,
} from '../../features/episode'
import type { EpisodePageData, EpisodePanelData, EpisodeResponse } from '../../features/episode'

type SidebarTab = 'settings' | 'detail'

export default function SceneManagementPage() {
  const navigate = useNavigate()
  const { id, episodeId } = useParams()
  const storyId = Number(id)
  const epId = Number(episodeId)
  const { showError } = useApiError()

  const [episodeTitle, setEpisodeTitle] = useState<string>('')
  const [episodes, setEpisodes] = useState<EpisodeResponse[]>([])
  const [pages, setPages] = useState<EpisodePageData[]>([])
  const [selectedPage, setSelectedPage] = useState<EpisodePageData | null>(null)
  const [selectedPanel, setSelectedPanel] = useState<EpisodePanelData | null>(null)
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('settings')
  const [loading, setLoading] = useState(true)
  const [generatingInitial, setGeneratingInitial] = useState(false)
  const [showLayoutConfirm, setShowLayoutConfirm] = useState(false)
  const [showPanelModal, setShowPanelModal] = useState(false)
  const [scale, setScale] = useState(1)

  const handlePagesUpdated = useCallback((updated: EpisodePageData[]) => {
    setPages(updated)
    setSelectedPage((prev) => prev ? (updated.find((p) => p.pageNumber === prev.pageNumber) ?? prev) : prev)
  }, [])

  const handleLayoutCompleted = useCallback((updated: EpisodePageData[]) => {
    setPages(updated)
    if (updated.length > 0) setSelectedPage(updated[0])
  }, [])

  const {
    generatingPages,
    regeneratingLayout,
    lastUsedModel,
    lastImageModel,
    initFromActiveJobs,
    startImageJob,
    startLayoutJob,
  } = useSceneJobs(storyId, epId, {
    onPagesUpdated: handlePagesUpdated,
    onLayoutCompleted: handleLayoutCompleted,
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [ep, epList, pageList, activeJobs] = await Promise.all([
          episodeApi.getEpisode(storyId, epId),
          episodeApi.getEpisodes(storyId),
          episodePageApi.getPages(storyId, epId),
          episodePageApi.getActiveJobs(storyId, epId),
        ])
        setEpisodeTitle(ep.title)
        setEpisodes(epList)
        setPages(pageList)
        if (pageList.length > 0) setSelectedPage(pageList[0])
        initFromActiveJobs(activeJobs)
      } catch (e) {
        showError(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [storyId, epId, showError, initFromActiveJobs])

  async function handleInitialGenerate() {
    setGeneratingInitial(true)
    try {
      const res = await episodePageApi.regenerate(storyId, epId)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      if (res.body) {
        const reader = res.body.getReader()
        while (true) {
          const { done } = await reader.read()
          if (done) break
        }
      }
      const pageList = await episodePageApi.getPages(storyId, epId)
      setPages(pageList)
      if (pageList.length > 0) setSelectedPage(pageList[0])
    } catch (e) {
      showError(e)
    } finally {
      setGeneratingInitial(false)
    }
  }

  async function handleRegenerateLayout() {
    try {
      await startLayoutJob()
    } catch (e) {
      showError(e)
    }
  }

  async function handleRegenerateImage() {
    if (!selectedPage) return
    try {
      await startImageJob(selectedPage.pageNumber)
    } catch (e) {
      showError(e)
    }
  }

  function handleSelectPanel(panel: EpisodePanelData) {
    setSelectedPanel(panel)
    setShowPanelModal(true)
  }

  const isCurrentPageGenerating = selectedPage ? generatingPages.has(selectedPage.pageNumber) : false

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
        <nav className="text-[13px] text-[var(--text)] flex items-center gap-1.5">
          <span>マンガ作成</span>
          <span className="text-[var(--border)]">/</span>
          <span className="font-semibold text-[var(--text-h)] truncate max-w-[200px]">
            {episodeTitle}
          </span>
        </nav>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowLayoutConfirm(true)}
          disabled={regeneratingLayout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          {regeneratingLayout ? (
            <><SpinnerDots size="sm" />再生成中...</>
          ) : (
            <><RefreshIcon size={12} />コマ割り再生成</>
          )}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: episode list */}
        <div className="w-44 shrink-0 flex flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg)]">
          <button
            type="button"
            onClick={() => navigate(`/stories/${id}/episodes`)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-50 transition-colors cursor-pointer border-0 border-b border-[var(--border)] bg-transparent w-full shrink-0"
          >
            <ArrowLeftIcon size={13} />
            エピソード一覧
          </button>
          <div className="flex-1 overflow-y-auto">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => navigate(`/stories/${id}/episodes/${ep.id}/scenes`)}
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

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <SpinnerDots size="md" />
              <p className="text-[13px] text-[var(--text)]">読み込み中...</p>
            </div>
          </div>
        ) : pages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            {generatingInitial || regeneratingLayout ? (
              <div className="flex flex-col items-center gap-3">
                <SpinnerDots size="md" />
                <p className="text-[13px] text-[var(--text)]">ページを生成中...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-[13px] text-[var(--text)]">ページデータがありません</p>
                <Button variant="primary" onClick={handleInitialGenerate} className="text-[13px]">
                  新規生成
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              {/* Page thumbnail list */}
              <div className="w-20 shrink-0 flex flex-col overflow-y-auto bg-black/50 gap-2 py-3 px-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      if (regeneratingLayout) return
                      setSelectedPage(page)
                      setSelectedPanel(null)
                    }}
                    className="shrink-0 flex flex-col items-center gap-1 cursor-pointer border-0 bg-transparent p-0"
                  >
                    <div
                      className={`w-14 rounded overflow-hidden border-2 transition-all relative ${
                        selectedPage?.id === page.id
                          ? 'border-[var(--accent)]'
                          : 'border-transparent hover:border-[var(--accent-border)]'
                      }`}
                      style={{ height: '64px' }}
                    >
                      {page.imageUrl ? (
                        <img src={page.imageUrl} alt={`ページ${page.pageNumber}`} className="w-full h-full object-cover" />
                      ) : (
                        <PagePreview page={page} mini />
                      )}
                      {generatingPages.has(page.pageNumber) && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <SpinnerDots size="sm" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] transition-colors ${selectedPage?.id === page.id ? 'text-white font-semibold' : 'text-white/70'}`}>
                      {page.pageNumber}
                    </span>
                  </button>
                ))}
              </div>

              {/* Center: page preview */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#f7f6f3]">
                {selectedPage && (
                  <>
                    <div className="px-5 pt-4 pb-2 shrink-0 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[var(--text-h)]">
                        ページ{selectedPage.pageNumber}
                      </span>
                      {isCurrentPageGenerating ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                          <SpinnerDots size="sm" />生成中
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          completed
                        </span>
                      )}
                      <div className="flex-1" />
                      <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg overflow-hidden">
                        <button type="button" onClick={() => setScale((s) => Math.min(s + 0.25, 3))} className="px-2.5 py-1.5 text-[13px] text-[var(--text-h)] hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-0">+</button>
                        <span className="text-[11px] text-[var(--text)] px-1 select-none">{Math.round(scale * 100)}%</span>
                        <button type="button" onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))} className="px-2.5 py-1.5 text-[13px] text-[var(--text-h)] hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-0">−</button>
                      </div>
                      <button
                        type="button"
                        onClick={handleRegenerateImage}
                        disabled={isCurrentPageGenerating || regeneratingLayout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                      >
                        {isCurrentPageGenerating ? (
                          <><SpinnerDots size="sm" />生成中...</>
                        ) : (
                          <><RefreshIcon size={12} />ページ画像再生成</>
                        )}
                      </button>
                    </div>
                    <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
                      <div
                        className="shadow-lg relative shrink-0"
                        style={{ width: '360px', height: '504px', transform: `scale(${scale})`, transformOrigin: 'top center' }}
                      >
                        {selectedPage.imageUrl ? (
                          <img src={selectedPage.imageUrl} alt={`ページ${selectedPage.pageNumber}`} className="w-full h-full object-cover" />
                        ) : (
                          <PagePreview page={selectedPage} selectedPanelId={selectedPanel?.id} onSelectPanel={handleSelectPanel} />
                        )}
                        {isCurrentPageGenerating && (
                          <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center gap-3 rounded">
                            <SpinnerDots size="md" />
                            <p className="text-[13px] text-[var(--text)]">画像を生成中...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right sidebar */}
              <SceneRightPanel
                selectedPage={selectedPage}
                selectedPanel={selectedPanel}
                tab={sidebarTab}
                onTabChange={setSidebarTab}
                onSelectPanel={handleSelectPanel}
              />
            </div>

            {/* コマ割り再生成中オーバーレイ */}
            {regeneratingLayout && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-4 z-10">
                <SpinnerDots size="md" />
                <p className="text-[14px] font-semibold text-[var(--text-h)]">コマ割りを再生成中...</p>
                <p className="text-[12px] text-[var(--text)]">ページを離れても進捗は保持されます</p>
              </div>
            )}
            {!regeneratingLayout && (lastUsedModel || lastImageModel) && (
              <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1">
                {lastUsedModel && (
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-mono">{lastUsedModel}</span>
                )}
                {lastImageModel && (
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-mono">img: {lastImageModel}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showLayoutConfirm}
        title="コマ割りを再生成しますか？"
        message="現在のコマ割りとページ画像プロンプトはすべて削除されます。この操作は取り消せません。"
        confirmLabel="再生成する"
        onConfirm={() => { setShowLayoutConfirm(false); handleRegenerateLayout() }}
        onCancel={() => setShowLayoutConfirm(false)}
      />

      <PanelDetailModal
        panel={selectedPanel}
        open={showPanelModal}
        onClose={() => setShowPanelModal(false)}
      />
    </div>
  )
}
