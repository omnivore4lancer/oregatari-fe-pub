import type { Meta, StoryObj } from '@storybook/react-vite'

import { PanelDetailModal } from './PanelDetailModal'
import type { EpisodePanelData } from '../../types/episodePage'

const mockPanel: EpisodePanelData = {
  id: 1,
  panelOrder: 2,
  pagePosition: null,
  description: '主人公が剣を構え、敵を睨みつける緊迫したシーン。',
  cameraAngle: 'アオリ',
  perspectiveIntensity: '強め',
  depthLayers: {},
  background: '廃墟の城',
  characters: [
    {
      name: '信長',
      emotion: '怒り',
      pose: '正面・攻撃姿勢',
      lines: [{ text: '天下は我が手に！' }],
    },
  ],
  effects: ['スピード線', '衝撃波'],
  lensAndLighting: '広角・逆光',
  frame: 'normal',
  scale: 1,
  imagePrompt: 'A fierce samurai in battle stance, wide angle, dramatic lighting',
  imageUrl: null,
}

const meta = {
  title: 'Features/Episode/PanelDetailModal',
  component: PanelDetailModal,
  parameters: { layout: 'centered' },
  args: { panel: mockPanel, open: true, onClose: () => {} },
} satisfies Meta<typeof PanelDetailModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = {
  args: { open: false },
}
