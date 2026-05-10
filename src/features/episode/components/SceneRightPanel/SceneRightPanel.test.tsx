import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SceneRightPanel } from './SceneRightPanel'
import type { EpisodePageData } from '../../types/episodePage'

vi.mock('../PagePreview/PagePreview', () => ({
  PagePreview: () => <div data-testid="page-preview" />,
}))

const mockPage: EpisodePageData = {
  id: 1,
  pageNumber: 1,
  instructions: null,
  imageUrl: null,
  displayImageUrl: null,
  rows: [
    {
      id: 1,
      rowNumber: 1,
      heightRatio: '0.5',
      layoutType: '2コマ',
      panels: [
        {
          id: 1,
          panelOrder: 1,
          pagePosition: null,
          description: '冒頭シーン',
          cameraAngle: null,
          perspectiveIntensity: null,
          depthLayers: {},
          background: null,
          characters: [],
          effects: [],
          lensAndLighting: null,
          frame: 'normal',
          scale: 1,
          imagePrompt: null,
          imageUrl: null,
        },
      ],
    },
  ],
}

describe('SceneRightPanel', () => {
  it('settings タブのとき PagePreview が表示される', () => {
    render(
      <SceneRightPanel
        selectedPage={mockPage}
        selectedPanel={null}
        tab="settings"
        onTabChange={vi.fn()}
        onSelectPanel={vi.fn()}
      />,
    )
    expect(screen.getByTestId('page-preview')).toBeInTheDocument()
  })

  it('detail タブのとき panel の description が表示される', () => {
    render(
      <SceneRightPanel
        selectedPage={mockPage}
        selectedPanel={null}
        tab="detail"
        onTabChange={vi.fn()}
        onSelectPanel={vi.fn()}
      />,
    )
    expect(screen.getByText('冒頭シーン')).toBeInTheDocument()
  })
})
