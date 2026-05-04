import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { vi } from 'vitest'

import { SceneRightPanel } from './SceneRightPanel'
import type { EpisodePageData } from '../../types/episodePage'

vi.mock('../PagePreview/PagePreview', () => ({
  PagePreview: () => <div style={{ background: '#eee', width: '100%', height: '100%' }} />,
}))

const mockPage: EpisodePageData = {
  id: 1,
  pageNumber: 1,
  instructions: null,
  imageUrl: null,
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
          description: '主人公が剣を構える緊迫シーン。',
          cameraAngle: 'アオリ',
          perspectiveIntensity: null,
          depthLayers: {},
          background: null,
          characters: [],
          effects: ['スピード線'],
          lensAndLighting: null,
          frame: 'normal',
          scale: 1,
          imagePrompt: 'samurai with sword',
          imageUrl: null,
        },
      ],
    },
  ],
}

const meta = {
  title: 'Features/Episode/SceneRightPanel',
  component: SceneRightPanel,
  parameters: { layout: 'padded' },
  args: {
    selectedPage: mockPage,
    selectedPanel: null,
    tab: 'settings' as const,
    onTabChange: () => {},
    onSelectPanel: () => {},
  },
} satisfies Meta<typeof SceneRightPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Settings: Story = {}

export const Detail: Story = {
  args: { tab: 'detail' },
}

export const Interactive: Story = {
  render: () => {
    const [tab, setTab] = useState<'settings' | 'detail'>('settings')
    return (
      <SceneRightPanel
        selectedPage={mockPage}
        selectedPanel={null}
        tab={tab}
        onTabChange={setTab}
        onSelectPanel={() => {}}
      />
    )
  },
}
