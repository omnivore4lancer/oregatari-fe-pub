import type { Meta, StoryObj } from '@storybook/react-vite'

import { PanelDetail } from './PanelDetail'
import type { Panel } from '../../types'

const mockPanel: Panel = {
  id: 'p1',
  vertices: [[0, 0], [1, 0], [1, 1], [0, 1]],
  prompt: 'キャラクターが夕日を見ている後ろ姿。ロングショット。',
  imageUrl: null,
}

const meta = {
  title: 'Features/PanelEditor/PanelDetail',
  component: PanelDetail,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PanelDetail>

export default meta
type Story = StoryObj<typeof meta>

export const NoSelection: Story = {
  args: { panel: null, onUpdate: () => {}, onDelete: () => {} },
}

export const Empty: Story = {
  args: {
    panel: { ...mockPanel, prompt: '' },
    onUpdate: () => {},
    onDelete: () => {},
  },
}

export const WithPrompt: Story = {
  args: { panel: mockPanel, onUpdate: () => {}, onDelete: () => {} },
}
