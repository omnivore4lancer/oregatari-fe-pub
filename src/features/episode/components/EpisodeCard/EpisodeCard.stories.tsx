import type { Meta, StoryObj } from '@storybook/react-vite'

import { EpisodeCard } from './EpisodeCard'

const base = {
  id: 1,
  number: 1,
  title: '信長SNSデビュー',
  status: '未公開' as const,
  relation: '単独' as const,
  description: 'SNSの誹謗中傷に悩む胡蝶の姿を見て、ふと自分がスマホを操作して成敗してやろうと思い立つ。',
  createdAt: '2026/04/22',
  characterIds: [],
  inheritRelation: true,
}

const meta = {
  title: 'Features/Episode/EpisodeCard',
  component: EpisodeCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EpisodeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Generating: Story = {
  args: { episode: { ...base, generatingState: 'generating' } },
}

export const Done: Story = {
  args: { episode: { ...base, generatingState: 'done' } },
}

export const Published: Story = {
  args: { episode: { ...base, status: '公開中', generatingState: 'done' } },
}

export const WithCallbacks: Story = {
  args: {
    episode: { ...base, generatingState: 'done' },
    onEdit: () => {},
    onDelete: () => {},
  },
}
