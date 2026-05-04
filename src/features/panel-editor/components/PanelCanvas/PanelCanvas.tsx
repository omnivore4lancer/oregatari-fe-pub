import { useRef, useState } from 'react'

import { ImageIcon } from '../../../../components/Icons'
import type { Panel } from '../../types'

// ─── ID generator ──────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

// ─── Polygon math ───────────────────────────────────────────────

type Pt = [number, number]

/** Signed area of cross product — determines which side of a line a point is on */
function sideOf(p: Pt, l1: Pt, l2: Pt): number {
  return (l2[0] - l1[0]) * (p[1] - l1[1]) - (l2[1] - l1[1]) * (p[0] - l1[0])
}

/** Intersection of infinite line (l1→l2) with finite segment (p1→p2) */
function segIntersect(l1: Pt, l2: Pt, p1: Pt, p2: Pt): Pt {
  const dx = l2[0] - l1[0],
    dy = l2[1] - l1[1]
  const ex = p2[0] - p1[0],
    ey = p2[1] - p1[1]
  const d = dx * ey - dy * ex
  if (Math.abs(d) < 1e-12) return [...p1]
  const t = ((p1[0] - l1[0]) * ey - (p1[1] - l1[1]) * ex) / d
  return [l1[0] + t * dx, l1[1] + t * dy]
}

/** Split a convex polygon by an infinite line into two polygons */
function splitPolygon(verts: Pt[], l1: Pt, l2: Pt): [Pt[], Pt[]] {
  const left: Pt[] = [],
    right: Pt[] = []
  const n = verts.length
  for (let i = 0; i < n; i++) {
    const a = verts[i],
      b = verts[(i + 1) % n]
    const da = sideOf(a, l1, l2),
      db = sideOf(b, l1, l2)
    if (da >= 0) left.push([...a])
    else right.push([...a])
    if ((da > 0 && db < 0) || (da < 0 && db > 0)) {
      const pt = segIntersect(l1, l2, a, b)
      left.push(pt)
      right.push(pt)
    }
  }
  return [left, right]
}

/** Point-in-polygon ray casting */
function pointInPolygon(px: number, py: number, verts: Pt[]): boolean {
  let inside = false
  const n = verts.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = verts[i],
      [xj, yj] = verts[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function findPanelAt(panels: Panel[], nx: number, ny: number): Panel | null {
  for (let i = panels.length - 1; i >= 0; i--)
    if (pointInPolygon(nx, ny, panels[i].vertices)) return panels[i]
  return null
}

/** Extend line far beyond canvas, split the target panel's polygon */
function performSplit(panels: Panel[], panelId: string, p1: Pt, p2: Pt): Panel[] {
  const src = panels.find((p) => p.id === panelId)
  if (!src) return panels
  const rest = panels.filter((p) => p.id !== panelId)
  const dx = p2[0] - p1[0],
    dy = p2[1] - p1[1]
  const ext1: Pt = [p1[0] - dx * 20, p1[1] - dy * 20]
  const ext2: Pt = [p2[0] + dx * 20, p2[1] + dy * 20]
  const [a, b] = splitPolygon(src.vertices, ext1, ext2)
  if (a.length < 3 || b.length < 3) return panels
  return [
    ...rest,
    { ...src, id: genId(), vertices: a, prompt: '', imageUrl: null },
    { ...src, id: genId(), vertices: b, prompt: '', imageUrl: null },
  ]
}

/** Find where the infinite line (p1→p2) intersects the polygon boundary — for preview */
function lineClipToPoly(p1: Pt, p2: Pt, verts: Pt[]): [Pt, Pt] | null {
  const dx = p2[0] - p1[0],
    dy = p2[1] - p1[1]
  const e1: Pt = [p1[0] - dx * 20, p1[1] - dy * 20]
  const e2: Pt = [p2[0] + dx * 20, p2[1] + dy * 20]
  const pts: Pt[] = []
  const n = verts.length
  for (let i = 0; i < n; i++) {
    const a = verts[i],
      b = verts[(i + 1) % n]
    const da = sideOf(a, e1, e2),
      db = sideOf(b, e1, e2)
    if ((da > 0 && db < 0) || (da < 0 && db > 0)) pts.push(segIntersect(e1, e2, a, b))
    else if (Math.abs(da) < 1e-10 && Math.abs(db) > 1e-10) pts.push([...a])
  }
  return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null
}

// ─── Helpers for rendering ───────────────────────────────────────

function toSvgPoints(verts: Pt[]): string {
  return verts.map(([x, y]) => `${x},${y}`).join(' ')
}

function toCssClip(verts: Pt[]): string {
  return `polygon(${verts.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(', ')})`
}

function centroid(verts: Pt[]): Pt {
  return [
    verts.reduce((s, [x]) => s + x, 0) / verts.length,
    verts.reduce((s, [, y]) => s + y, 0) / verts.length,
  ]
}

// ─── Component ──────────────────────────────────────────────────

interface DragState {
  panelId: string
  start: Pt
  current: Pt
}

interface Props {
  panels: Panel[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (panels: Panel[]) => void
}

const MIN_SPLIT_DIST = 0.04

export function PanelCanvas({ panels, selectedId, onSelect, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [drag, setDrag] = useState<DragState | null>(null)

  function getNorm(e: MouseEvent | React.MouseEvent): Pt {
    const r = containerRef.current!.getBoundingClientRect()
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    e.preventDefault()
    const pos = getNorm(e)
    const panel = findPanelAt(panels, pos[0], pos[1])
    if (!panel) return

    const init: DragState = { panelId: panel.id, start: pos, current: pos }
    dragRef.current = init
    setDrag(init)
    const capturedPanels = panels

    function onMove(me: MouseEvent) {
      const cur = getNorm(me)
      const next = { ...dragRef.current!, current: cur }
      dragRef.current = next
      setDrag(next)
    }

    function onUp(me: MouseEvent) {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      if (!d) return
      const cur = getNorm(me)
      const dx = cur[0] - d.start[0],
        dy = cur[1] - d.start[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MIN_SPLIT_DIST) {
        onSelect(d.panelId)
      } else {
        onChange(performSplit(capturedPanels, d.panelId, d.start, cur))
        onSelect(null)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Preview calculations
  const srcPanel = drag ? panels.find((p) => p.id === drag.panelId) : null
  const dragDist = drag
    ? Math.hypot(drag.current[0] - drag.start[0], drag.current[1] - drag.start[1])
    : 0
  const isDrawing = !!drag && dragDist > 0.005
  const cutLine =
    isDrawing && srcPanel && dragDist > 0.01
      ? lineClipToPoly(drag!.start, drag!.current, srcPanel.vertices)
      : null

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-900 shadow-xl select-none overflow-hidden"
      style={{ aspectRatio: '210/297', cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
    >
      {/* Panel content (CSS clip-path) */}
      {panels.map((panel, idx) => {
        const [cx, cy] = centroid(panel.vertices)
        return (
          <div
            key={panel.id}
            className="absolute inset-0 bg-white"
            style={{ clipPath: toCssClip(panel.vertices) }}
          >
            {panel.imageUrl ? (
              <img src={panel.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-200 pointer-events-none">
                <ImageIcon size={18} />
              </div>
            )}
            <span
              className="absolute text-[8px] text-gray-400 bg-white/80 px-1 rounded leading-tight pointer-events-none"
              style={{
                left: `${cx * 100}%`,
                top: `${cy * 100}%`,
                transform: 'translate(-50%,-50%)',
              }}
            >
              {idx + 1}
            </span>
          </div>
        )
      })}

      {/* SVG overlay: panel borders + drag preview */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        {/* Borders for unselected panels */}
        {panels
          .filter((p) => p.id !== selectedId)
          .map((panel) => (
            <polygon
              key={panel.id}
              points={toSvgPoints(panel.vertices)}
              fill="none"
              stroke="#111827"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        {/* Selected panel border on top */}
        {selectedId && panels.find((p) => p.id === selectedId) && (
          <polygon
            points={toSvgPoints(panels.find((p) => p.id === selectedId)!.vertices)}
            fill="none"
            stroke="rgb(168,85,247)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Start point dot — shown immediately on mousedown */}
        {drag && (
          <line
            x1={drag.start[0]}
            y1={drag.start[1]}
            x2={drag.start[0]}
            y2={drag.start[1]}
            stroke="rgb(168,85,247)"
            strokeWidth="8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Ghost line + cut preview — shown once mouse starts moving */}
        {isDrawing && drag && (
          <>
            <line
              x1={drag.start[0]}
              y1={drag.start[1]}
              x2={drag.current[0]}
              y2={drag.current[1]}
              stroke="rgba(168,85,247,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="5 3"
              vectorEffect="non-scaling-stroke"
            />
            {cutLine && (
              <line
                x1={cutLine[0][0]}
                y1={cutLine[0][1]}
                x2={cutLine[1][0]}
                y2={cutLine[1][1]}
                stroke="rgb(168,85,247)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </>
        )}
      </svg>
    </div>
  )
}
