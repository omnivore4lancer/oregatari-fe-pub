import type { Meta, StoryObj } from '@storybook/react-vite'

import { AiPanel } from './AiPanel'

const meta = {
  title: 'Features/Episode/AiPanel',
  component: AiPanel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AiPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
