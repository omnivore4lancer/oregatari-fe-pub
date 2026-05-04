import type { Meta, StoryObj } from '@storybook/react-vite'
import { SceneCreateConfirmDialog } from './SceneCreateConfirmDialog'

const meta = {
  title: 'Features/Episode/SceneCreateConfirmDialog',
  component: SceneCreateConfirmDialog,
  parameters: { layout: 'centered' },
  args: { open: true, episodeTitle: '第1話：出会いの朝', generating: false, onConfirm: () => {}, onCancel: () => {} },
} satisfies Meta<typeof SceneCreateConfirmDialog>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Generating: Story = { args: { generating: true } }
