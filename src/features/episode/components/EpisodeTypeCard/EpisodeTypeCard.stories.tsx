import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { EpisodeTypeCard } from './EpisodeTypeCard'

const meta = {
  title: 'Features/Episode/EpisodeTypeCard',
  component: EpisodeTypeCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EpisodeTypeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Unselected: Story = {
  args: {
    icon: <span className="text-2xl">📖</span>,
    title: '独立エピソード',
    description: '前後のエピソードとは独立した一話完結のエピソードです。',
    selected: false,
    onSelect: () => {},
  },
}

export const Selected: Story = {
  args: {
    ...Unselected.args,
    selected: true,
  },
}

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState<'独立' | '続編'>('独立')
    return (
      <div className="flex gap-4">
        <EpisodeTypeCard
          icon={<span className="text-2xl">📖</span>}
          title="独立エピソード"
          description="前後のエピソードとは独立した一話完結のエピソードです。"
          selected={selected === '独立'}
          onSelect={() => setSelected('独立')}
        />
        <EpisodeTypeCard
          icon={<span className="text-2xl">↩</span>}
          title="続編エピソード"
          description="既存のエピソードの続きとなるエピソードです。"
          selected={selected === '続編'}
          onSelect={() => setSelected('続編')}
        />
      </div>
    )
  },
}
