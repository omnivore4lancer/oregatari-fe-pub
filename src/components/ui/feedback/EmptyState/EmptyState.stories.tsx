import type { Meta, StoryObj } from '@storybook/react-vite'

import { EmptyState } from './EmptyState'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  argTypes: {
    message: { control: 'text' },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { message: '該当するエピソードがありません' },
}

export const WithIcon: Story = {
  args: {
    message: '素材がありません。「素材を生成」から作成しましょう。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
}
