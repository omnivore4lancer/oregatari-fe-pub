import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ArrowLeftIcon } from '../../components/Icons'
import { useApiError } from '../../contexts/ApiErrorContext'
import { panelApi, type Panel, PanelCanvas, PanelDetail } from '../../features/panel-editor'

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

function makeInitialPanels(): Panel[] {
  return [
    {
      id: genId(),
      vertices: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      prompt: '',
      imageUrl: null,
    },
  ]
}

interface HistoryState {
  history: Panel[][]
  index: number
}

export default function PanelEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()

  const [{ history, index }, setState] = useState<HistoryState>(() => ({
    history: [makeInitialPanels()],
    index: 0,
  }))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const panels = history[index]

  useEffect(() => {
    panelApi
      .getPanels(storyId)
      .then((data) => {
        if (data.length > 0) {
          setState({ history: [data as Panel[]], index: 0 })
        }
      })
      .catch(showError)
  }, [storyId, showError])

  function pushHistory(newPanels: Panel[]) {
    setState((prev) => ({
      history: [...prev.history.slice(0, prev.index + 1), newPanels],
      index: prev.index + 1,
    }))
    setSelectedId(null)
  }

  function handleUndo() {
    if (index > 0) {
      setState((prev) => ({ ...prev, index: prev.index - 1 }))
      setSelectedId(null)
    }
  }

  function handleRedo() {
    setState((prev) =>
      prev.index < prev.history.length - 1 ? { ...prev, index: prev.index + 1 } : prev,
    )
  }

  function handleReset() {
    pushHistory(makeInitialPanels())
  }

  function handlePanelsChange(newPanels: Panel[]) {
    pushHistory(newPanels)
  }

  function handleDelete(panelId: string) {
    if (panels.length <= 1) return
    pushHistory(panels.filter((p) => p.id !== panelId))
  }

  function handleUpdate(updated: Panel) {
    setState((prev) => {
      const newHistory = [...prev.history]
      newHistory[prev.index] = prev.history[prev.index].map((p) =>
        p.id === updated.id ? updated : p,
      )
      return { ...prev, history: newHistory }
    })
    setSelectedId(updated.id)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await panelApi.savePanels(storyId, panels)
    } catch (e) {
      showError(e)
    } finally {
      setSaving(false)
    }
  }

  const selectedPanel = selectedId ? (panels.find((p) => p.id === selectedId) ?? null) : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
        <button
          type="button"
          onClick={() => navigate(`/stories/${id}/episodes`)}
          className="p-1.5 rounded text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-100 transition-colors cursor-pointer border-0 bg-transparent"
          title="エピソード一覧に戻る"
        >
          <ArrowLeftIcon size={15} />
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <span className="text-[13px] font-semibold text-[var(--text-h)]">コマ割り編集</span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleUndo}
          disabled={index === 0}
          className="px-2.5 py-1 rounded text-[12px] text-[var(--text-h)] border border-[var(--border)] disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-colors bg-transparent"
        >
          元に戻す
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={index === history.length - 1}
          className="px-2.5 py-1 rounded text-[12px] text-[var(--text-h)] border border-[var(--border)] disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-colors bg-transparent"
        >
          やり直す
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-2.5 py-1 rounded text-[12px] text-red-500 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer bg-transparent"
        >
          リセット
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-br from-purple-400 via-purple-500 to-violet-700 cursor-pointer hover:opacity-90 transition-opacity border-0 disabled:opacity-60"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f7f6f3] overflow-auto gap-3">
          <div className="w-full max-w-sm">
            <PanelCanvas
              panels={panels}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={handlePanelsChange}
            />
          </div>
          <p className="text-[11px] text-[var(--text)]">
            ドラッグで線を引いてコマを分割 / クリックでコマを選択
          </p>
        </div>

        <PanelDetail panel={selectedPanel} onUpdate={handleUpdate} onDelete={handleDelete} />
      </div>
    </div>
  )
}
