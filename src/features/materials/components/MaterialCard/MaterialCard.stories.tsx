import type { Meta, StoryObj } from '@storybook/react-vite'

import { MaterialCard } from './MaterialCard'

const meta = {
  title: 'Features/Materials/MaterialCard',
  component: MaterialCard,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MaterialCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: '胡蝶の部屋', date: '2026/4/23' },
}

export const Grid: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <MaterialCard title="胡蝶の部屋" date="2026/4/23" />
      <MaterialCard title="王都の夜市" date="2026/4/20" />
      <MaterialCard title="本能寺" date="2026/4/18" />
    </div>
  ),
}
