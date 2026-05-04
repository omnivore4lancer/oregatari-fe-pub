import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PanelDetailModal } from './PanelDetailModal'
import type { EpisodePanelData } from '../../types/episodePage'

const mockPanel: EpisodePanelData = {
  id: 1,
  panelOrder: 1,
  pagePosition: null,
  description: '主人公が剣を構える',
  cameraAngle: 'アオリ',
  perspectiveIntensity: '強め',
  depthLayers: {},
  background: null,
  characters: [{ name: '信長', emotion: '怒り', pose: '正面', lines: [{ text: '天下を取る' }] }],
  effects: ['スピード線'],
  lensAndLighting: '広角',
  frame: 'normal',
  scale: 1,
  imagePrompt: null,
  imageUrl: null,
}

describe('PanelDetailModal', () => {
  it('open=false のとき何も描画しない', () => {
    const { container } = render(<PanelDetailModal panel={mockPanel} open={false} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('panel の description が表示される', () => {
    render(<PanelDetailModal panel={mockPanel} open={true} onClose={vi.fn()} />)
    expect(screen.getByText('主人公が剣を構える')).toBeInTheDocument()
  })

  it('キャラクターのセリフが表示される', () => {
    render(<PanelDetailModal panel={mockPanel} open={true} onClose={vi.fn()} />)
    expect(screen.getByText(/天下を取る/)).toBeInTheDocument()
  })
})
