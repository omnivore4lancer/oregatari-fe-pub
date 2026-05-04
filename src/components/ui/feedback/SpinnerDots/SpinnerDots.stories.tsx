import type { Meta, StoryObj } from '@storybook/react-vite'

import { SpinnerDots } from './SpinnerDots'

const meta = {
  title: 'UI/SpinnerDots',
  component: SpinnerDots,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof SpinnerDots>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const InContext: Story = {
  render: () => (
    <span className="flex items-center gap-1.5 text-[13px] text-[var(--accent)]">
      <SpinnerDots size="sm" />
      エピソード生成中...
    </span>
  ),
}
