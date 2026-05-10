import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PagePreview } from './PagePreview'
import type { EpisodePageData } from '../../types/episodePage'

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
      heightRatio: '50%',
      layoutType: '左右均等',
      panels: [
        { id: 1, panelOrder: 1, pagePosition: null, description: 'パネル1', cameraAngle: null, perspectiveIntensity: null, depthLayers: {}, background: null, characters: [], effects: [], lensAndLighting: null, frame: 'solid', scale: 1, imagePrompt: null, imageUrl: null },
        { id: 2, panelOrder: 2, pagePosition: null, description: 'パネル2', cameraAngle: null, perspectiveIntensity: null, depthLayers: {}, background: null, characters: [], effects: [], lensAndLighting: null, frame: 'solid', scale: 1, imagePrompt: null, imageUrl: null },
      ],
    },
  ],
}

describe('PagePreview', () => {
  it('panels の数だけ button が表示される', () => {
    render(<PagePreview page={mockPage} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
