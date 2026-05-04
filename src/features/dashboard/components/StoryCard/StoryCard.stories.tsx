import { MemoryRouter } from 'react-router-dom'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { StoryCard } from './StoryCard'

const meta = {
  title: 'Features/Dashboard/StoryCard',
  component: StoryCard,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  args: {
    onDelete: () => {},
  },
} satisfies Meta<typeof StoryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    story: {
      id: 1,
      title: 'のぶにゃが',
      badge: 'ファンタジー',
      age: '1日前',
      coverImageUrl: null,
      previewImages: [],
    },
  },
}

export const WithCoverImage: Story = {
  args: {
    story: {
      id: 2,
      title: '星の詩人',
      badge: 'SF',
      age: '3日前',
      coverImageUrl: 'https://via.placeholder.com/160x200',
      previewImages: [],
    },
  },
}

export const WithPreviewImages: Story = {
  args: {
    story: {
      id: 3,
      title: '四枚の扉',
      badge: 'ミステリー',
      age: '1週間前',
      coverImageUrl: null,
      previewImages: [
        'https://via.placeholder.com/80x100/a78bfa',
        'https://via.placeholder.com/80x100/818cf8',
        'https://via.placeholder.com/80x100/6366f1',
        'https://via.placeholder.com/80x100/4f46e5',
      ],
    },
  },
}
