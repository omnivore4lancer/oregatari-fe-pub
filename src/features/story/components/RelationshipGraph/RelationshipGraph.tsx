import '@xyflow/react/dist/style.css'

import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  useNodesState,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import { useEffect, useMemo, useState } from 'react'

import { useApiError } from '../../../../contexts/ApiErrorContext'
import { useToast } from '../../../../contexts/ToastContext'
import { relationshipApi } from '../../api/relationshipApi'
import type { CharacterItem } from '../../types'

// ---- types ----

interface RelationshipItem {
  id: number
  storyId: number
  fromCharacterId: number
  toCharacterId: number
  type: string
  description: string | null
}

interface Props {
  storyId: number
  characters: CharacterItem[]
  relationships?: RelationshipItem[]
  onRelationshipsChange?: (relationships: RelationshipItem[]) => void
  onCharacterSelect?: (id: number | null) => void
  selectedCharacterId?: number | null
}

interface RelationshipDraft {
  id: number
  fromCharacterId: number
  toCharacterId: number
  type: string
  description: string
}

type DisplayMode = 'graph' | 'list' | 'edit'

const VIEW_MODES = [
  { key: 'fromProtagonist', label: '主人公 →' },
  { key: 'toProtagonist', label: '→ 主人公' },
  { key: 'others1to2', label: '他１ → 他２' },
  { key: 'others2to1', label: '他２ → 他１' },
] as const

type ViewModeKey = (typeof VIEW_MODES)[number]['key']

// ---- layout ----

function computePositions(characters: CharacterItem[]): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>()
  const protagonist = characters.find((c) => c.isProtagonist)
  const others = characters.filter((c) => !c.isProtagonist)

  if (protagonist) {
    positions.set(protagonist.id, { x: 0, y: 0 })
    const r = Math.max(240, others.length * 70)
    others.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / others.length - Math.PI / 2
      positions.set(c.id, {
        x: Math.round(r * Math.cos(angle)),
        y: Math.round(r * Math.sin(angle)),
      })
    })
  } else {
    const r = Math.max(200, characters.length * 60)
    characters.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / characters.length - Math.PI / 2
      positions.set(c.id, {
        x: Math.round(r * Math.cos(angle)),
        y: Math.round(r * Math.sin(angle)),
      })
    })
  }

  return positions
}

// ---- custom node ----

interface CharacterNodeData extends CharacterItem {
  isSelected?: boolean
}

function CharacterNode({ data }: NodeProps) {
  const c = data as unknown as CharacterNodeData
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ opacity: 0, width: 1, height: 1 }}
      />
      <div className="flex flex-col items-center gap-1 px-2 select-none">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[13px] shadow-sm transition-all ${
            c.isSelected
              ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)] scale-110'
              : c.isProtagonist
                ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent-border)]'
                : 'bg-white text-[var(--accent)] ring-2 ring-[var(--border)]'
          }`}
        >
          {c.initials}
        </div>
        <span
          className={`text-[11px] font-semibold whitespace-nowrap max-w-[88px] truncate text-center transition-colors ${
            c.isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'
          }`}
        >
          {c.name}
        </span>
        {c.role && (
          <span className="text-[10px] text-[var(--text)] whitespace-nowrap max-w-[88px] truncate text-center">
            {c.role}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={{ opacity: 0, width: 1, height: 1 }}
      />
    </>
  )
}

const nodeTypes = { character: CharacterNode }

// ---- main component ----

export function RelationshipGraph({
  storyId,
  characters,
  relationships = [],
  onRelationshipsChange,
  onCharacterSelect,
  selectedCharacterId,
}: Props) {
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [activeModes, setActiveModes] = useState<ViewModeKey>('fromProtagonist')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('graph')
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipItem | null>(null)
  const [drafts, setDrafts] = useState<RelationshipDraft[]>([])
  const [saving, setSaving] = useState(false)

  const protagonistId = useMemo(
    () => characters.find((c) => c.isProtagonist)?.id,
    [characters],
  )

  const [otherGroups, setOtherGroups] = useState<Map<number, 1 | 2>>(new Map())

  useEffect(() => {
    const others = characters.filter((c) => !c.isProtagonist)
    setOtherGroups((prev) => {
      const next = new Map(prev)
      others.forEach((c, i) => {
        if (!next.has(c.id)) next.set(c.id, i < Math.ceil(others.length / 2) ? 1 : 2)
      })
      for (const id of next.keys()) {
        if (!others.some((c) => c.id === id)) next.delete(id)
      }
      return next
    })
  }, [characters])

  function toggleGroup(id: number) {
    setOtherGroups((prev) => {
      const next = new Map(prev)
      next.set(id, prev.get(id) === 1 ? 2 : 1)
      return next
    })
  }

  // ---- React Flow nodes ----

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])

  useEffect(() => {
    if (characters.length === 0) { setNodes([]); return }
    const positions = computePositions(characters)
    setNodes((prev) => {
      const prevPosMap = new Map(prev.map((n) => [n.id, n.position]))
      return characters.map((c) => ({
        id: String(c.id),
        type: 'character',
        position: prevPosMap.get(String(c.id)) ?? (positions.get(c.id) ?? { x: 0, y: 0 }),
        data: { ...c, isSelected: c.id === selectedCharacterId } as unknown as Record<string, unknown>,
      }))
    })
  }, [characters, selectedCharacterId])

  // ---- edges ----

  function matchesFilter(fromId: number, toId: number): boolean {
    const pid = protagonistId
    const isFrom = fromId === pid
    const isTo = toId === pid
    const isBetween = !isFrom && !isTo
    if (activeModes === 'fromProtagonist') return isFrom
    if (activeModes === 'toProtagonist') return isTo
    if (activeModes === 'others1to2') return isBetween && otherGroups.get(fromId) === 1 && otherGroups.get(toId) === 2
    if (activeModes === 'others2to1') return isBetween && otherGroups.get(fromId) === 2 && otherGroups.get(toId) === 1
    return false
  }

  const edges = useMemo(
    () =>
      relationships
        .filter((r) => matchesFilter(r.fromCharacterId, r.toCharacterId))
        .map((r) => ({
          id: String(r.id),
          source: String(r.fromCharacterId),
          target: String(r.toCharacterId),
          label: r.type,
          labelStyle: { fill: '#6b6375', fontSize: 10, fontWeight: 500 },
          labelBgStyle: { fill: '#ffffff', fillOpacity: 0.92 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#c4b5fd', width: 16, height: 16 },
          style: { stroke: '#c4b5fd', strokeWidth: 1.5 },
          data: r as unknown as Record<string, unknown>,
        })),
    [relationships, activeModes, protagonistId, otherGroups],
  )

  // ---- filter for list / edit ----

  const filteredRelationships = useMemo(
    () => relationships.filter((r) => matchesFilter(r.fromCharacterId, r.toCharacterId)),
    [relationships, activeModes, protagonistId, otherGroups],
  )

  const filteredDrafts = useMemo(
    () => drafts.filter((d) => matchesFilter(d.fromCharacterId, d.toCharacterId)),
    [drafts, activeModes, protagonistId, otherGroups],
  )

  // ---- edit ----

  useEffect(() => {
    if (displayMode === 'edit') {
      setDrafts(
        relationships.map((r) => ({
          id: r.id,
          fromCharacterId: r.fromCharacterId,
          toCharacterId: r.toCharacterId,
          type: r.type,
          description: r.description ?? '',
        })),
      )
    }
  }, [displayMode]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateDraft(id: number, field: 'type' | 'description', value: string) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  function removeDraft(id: number) {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  async function commitEdit() {
    setSaving(true)
    try {
      const draftIds = new Set(drafts.map((d) => d.id))
      const deleted = relationships.filter((r) => !draftIds.has(r.id))
      const updated = drafts.filter((d) => {
        const orig = relationships.find((r) => r.id === d.id)
        if (!orig) return false
        return orig.type !== d.type || (orig.description ?? '') !== d.description
      })
      await Promise.all([
        ...deleted.map((r) => relationshipApi.deleteRelationship(storyId, r.id)),
        ...updated.map((d) =>
          relationshipApi.updateRelationship(storyId, d.id, {
            type: d.type,
            description: d.description || null,
          }),
        ),
      ])
      onRelationshipsChange?.(
        drafts.map((d) => ({
          id: d.id,
          storyId,
          fromCharacterId: d.fromCharacterId,
          toCharacterId: d.toCharacterId,
          type: d.type,
          description: d.description || null,
        })),
      )
      showToast('保存しました')
      setDisplayMode('graph')
    } catch (e) {
      showError(e)
    } finally {
      setSaving(false)
    }
  }

  const charMap = useMemo(() => new Map(characters.map((c) => [c.id, c])), [characters])

  const modeBtn = (mode: DisplayMode, label: string) => (
    <button
      key={mode}
      type="button"
      onClick={() => setDisplayMode(mode)}
      className={`text-[10px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
        displayMode === mode
          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
          : 'bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center gap-2">
        <span className="font-bold text-sm text-[var(--text-h)]">相関図</span>
        <span className="text-[11px] text-[var(--text)]">
          {characters.length}人 / {relationships.length}本
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {displayMode === 'edit' ? (
            <>
              <button
                type="button"
                onClick={() => setDisplayMode('graph')}
                disabled={saving}
                className="text-[10px] px-2.5 py-1 rounded border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={commitEdit}
                disabled={saving}
                className="text-[10px] px-2.5 py-1 rounded border bg-[var(--accent)] border-[var(--accent)] text-white cursor-pointer disabled:opacity-50"
              >
                {saving ? '保存中...' : '完了'}
              </button>
            </>
          ) : (
            <>
              {modeBtn('graph', 'グラフ')}
              {modeBtn('list', 'リスト')}
              {modeBtn('edit', '編集')}
            </>
          )}
        </div>
      </div>

      {/* 絞り込みボタン */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-[var(--border)]">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => setActiveModes(mode.key)}
            className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
              activeModes === mode.key
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : 'bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* コンテンツエリア + グループ割当サイドバー */}
      <div className="flex">
        <div className="flex-1 min-w-0">

      {displayMode === 'graph' && (
        <div style={{ height: 420 }}>
          {characters.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-[var(--text)]">
              キャラクターを追加すると表示されます
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onNodeClick={(_e, node) => {
                const id = Number(node.id)
                onCharacterSelect?.(selectedCharacterId === id ? null : id)
              }}
              onEdgeClick={(_e, edge) =>
                setSelectedRelationship(edge.data as unknown as RelationshipItem)
              }
              onPaneClick={() => onCharacterSelect?.(null)}
              fitView
              fitViewOptions={{ padding: 0.35 }}
              maxZoom={10}
              onInit={(rf) => {
                setTimeout(() => {
                  const { x, y, zoom } = rf.getViewport()
                  rf.setViewport({ x, y, zoom: zoom * 3 })
                }, 100)
              }}
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable={false}
              style={{ background: '#faf8ff' }}
            >
              <Background variant={BackgroundVariant.Dots} color="#ddd8f0" gap={22} size={1.2} />
              <Controls showInteractive={false} />
            </ReactFlow>
          )}
        </div>
      )}

      {displayMode === 'list' && (
        <div className="p-4">
          {filteredRelationships.length === 0 ? (
            <p className="text-xs text-[var(--text)] text-center py-8">該当する関係性がありません</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredRelationships.map((r) => {
                const from = charMap.get(r.fromCharacterId)
                const to = charMap.get(r.toCharacterId)
                return (
                  <div key={r.id} className="flex items-start gap-3 px-3 py-2.5 rounded border border-[var(--border)]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold text-[var(--text-h)]">{from?.name ?? `#${r.fromCharacterId}`}</span>
                        <span className="text-[10px] text-[var(--text)]">→</span>
                        <span className="text-[11px] font-semibold text-[var(--text-h)]">{to?.name ?? `#${r.toCharacterId}`}</span>
                      </div>
                      <span className="text-[10px] text-[var(--accent)] font-medium">{r.type}</span>
                      {r.description && (
                        <p className="text-[11px] text-[var(--text)] mt-0.5 leading-snug m-0">{r.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {displayMode === 'edit' && (
        <div className="p-4">
          {filteredDrafts.length === 0 ? (
            <p className="text-xs text-[var(--text)] text-center py-8">該当する関係性がありません</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDrafts.map((d) => {
                const from = charMap.get(d.fromCharacterId)
                const to = charMap.get(d.toCharacterId)
                return (
                  <div key={d.id} className="flex items-start gap-3 px-3 py-2.5 rounded border border-[var(--border)]">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-[var(--text-h)]">{from?.name ?? `#${d.fromCharacterId}`}</span>
                        <span className="text-[10px] text-[var(--text)]">→</span>
                        <span className="text-[11px] font-semibold text-[var(--text-h)]">{to?.name ?? `#${d.toCharacterId}`}</span>
                      </div>
                      <input
                        className="w-full bg-transparent border border-[var(--border)] rounded px-2 py-1 text-[11px] text-[var(--text-h)] outline-none focus:border-[var(--accent-border)] placeholder:text-[var(--text)]"
                        placeholder="関係性の種類"
                        value={d.type}
                        onChange={(e) => updateDraft(d.id, 'type', e.target.value)}
                      />
                      <textarea
                        className="w-full bg-transparent border border-[var(--border)] rounded px-2 py-1 text-[11px] text-[var(--text)] outline-none focus:border-[var(--accent-border)] resize-none placeholder:text-[var(--text)] leading-snug"
                        placeholder="説明（任意）"
                        rows={2}
                        value={d.description}
                        onChange={(e) => updateDraft(d.id, 'description', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDraft(d.id)}
                      className="mt-0.5 text-[var(--text)] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-1 text-sm shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

        </div>{/* flex-1 end */}

        {/* 他１・他２ グループ割当サイドバー */}
        {(activeModes === 'others1to2' || activeModes === 'others2to1') && (
          <div className="w-36 shrink-0 border-l border-[var(--border)] p-2.5 overflow-y-auto">
            {([1, 2] as const).map((g) => (
              <div key={g} className="mb-3">
                <div className="text-[10px] font-semibold text-[var(--text)] mb-1.5">
                  他{g === 1 ? '１' : '２'}
                </div>
                <div className="flex flex-col gap-1">
                  {characters
                    .filter((c) => !c.isProtagonist && otherGroups.get(c.id) === g)
                    .map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleGroup(c.id)}
                        title={`他${g === 1 ? '２' : '１'}へ移動`}
                        className="text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-h)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent text-left truncate"
                      >
                        {c.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>{/* flex end */}

      {/* エッジクリックモーダル */}
      {selectedRelationship && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedRelationship(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div>
                <p className="text-[10px] text-[var(--text)] mb-0.5">関係性</p>
                <h2 className="text-[15px] font-bold text-[var(--accent)] m-0">
                  {selectedRelationship.type}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRelationship(null)}
                className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors cursor-pointer bg-transparent border-none p-1 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] text-[var(--text)] leading-relaxed m-0">
                {selectedRelationship.description ?? '説明なし'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
