import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PanelDetail } from './PanelDetail'
import type { Panel } from '../../types'

const mockPanel: Panel = {
  id: 'p1',
  vertices: [[0, 0], [1, 0], [1, 1], [0, 1]],
  prompt: 'キャラクターが夕日を見ている後ろ姿。',
  imageUrl: null,
}

describe('PanelDetail', () => {
  it('panel の prompt が表示される', () => {
    render(<PanelDetail panel={mockPanel} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByDisplayValue('キャラクターが夕日を見ている後ろ姿。')).toBeInTheDocument()
  })

  it('panel=null のとき案内テキストが表示される', () => {
    render(<PanelDetail panel={null} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/コマをクリックして/)).toBeInTheDocument()
  })
})
