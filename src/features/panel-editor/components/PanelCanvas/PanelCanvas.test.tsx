import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PanelCanvas } from './PanelCanvas'
import type { Panel } from '../../types'

const panels: Panel[] = [
  { id: 'p1', vertices: [[0, 0], [1, 0], [1, 0.5], [0, 0.5]], prompt: '', imageUrl: null },
  { id: 'p2', vertices: [[0, 0.5], [1, 0.5], [1, 1], [0, 1]], prompt: '説明テキスト', imageUrl: null },
]

describe('PanelCanvas', () => {
  it('panels の数だけ panel 番号が表示される', () => {
    render(
      <PanelCanvas panels={panels} selectedId={null} onSelect={vi.fn()} onChange={vi.fn()} />,
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
