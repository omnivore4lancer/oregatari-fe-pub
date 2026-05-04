import type { Meta, StoryObj } from '@storybook/react-vite'
import { PagePreview } from './PagePreview'
import type { EpisodePageData } from '../../types/episodePage'

const mockPage: EpisodePageData = {
  id: 1,
  pageNumber: 1,
  instructions: null,
  imageUrl: null,
  rows: [
    {
      id: 1,
      rowNumber: 1,
      heightRatio: '50%',
      layoutType: '左右均等',
      panels: [
        { id: 1, panelOrder: 1, pagePosition: null, description: '主人公が立っている', cameraAngle: null, perspectiveIntensity: null, depthLayers: {}, background: null, characters: [], effects: [], lensAndLighting: null, frame: 'solid', scale: 1, imagePrompt: null, imageUrl: null },
        { id: 2, panelOrder: 2, pagePosition: null, description: '敵キャラが睨んでいる', cameraAngle: null, perspectiveIntensity: null, depthLayers: {}, background: null, characters: [], effects: [], lensAndLighting: null, frame: 'solid', scale: 1, imagePrompt: null, imageUrl: null },
      ],
    },
    {
      id: 2,
      rowNumber: 2,
      heightRatio: '50%',
      layoutType: '全面',
      panels: [
        { id: 3, panelOrder: 1, pagePosition: null, description: '激しい戦闘シーン', cameraAngle: null, perspectiveIntensity: null, depthLayers: {}, background: null, characters: [], effects: [], lensAndLighting: null, frame: 'solid', scale: 1, imagePrompt: null, imageUrl: null },
      ],
    },
  ],
}

const meta = {
  title: 'Features/Episode/PagePreview',
  component: PagePreview,
  parameters: { layout: 'centered' },
  args: { page: mockPage },
} satisfies Meta<typeof PagePreview>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Mini: Story = { args: { mini: true } }
export const StructureOnly: Story = { args: { structureOnly: true } }
