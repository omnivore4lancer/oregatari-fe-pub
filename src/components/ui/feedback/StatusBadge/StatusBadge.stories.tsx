import type { Meta, StoryObj } from '@storybook/react-vite'

import { StatusBadge } from './StatusBadge'

const meta = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'accent', 'warning', 'neutral'],
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: '未公開' },
}

export const Success: Story = {
  args: { label: '公開中', variant: 'success' },
}

export const Accent: Story = {
  args: { label: '有料プラン', variant: 'accent' },
}

export const Warning: Story = {
  args: { label: '要確認', variant: 'warning' },
}

export const Neutral: Story = {
  args: { label: '探索済み', variant: 'neutral' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      <StatusBadge label="未公開" variant="default" />
      <StatusBadge label="公開中" variant="success" />
      <StatusBadge label="有料プラン" variant="accent" />
      <StatusBadge label="要確認" variant="warning" />
      <StatusBadge label="探索済み" variant="neutral" />
    </div>
  ),
}
