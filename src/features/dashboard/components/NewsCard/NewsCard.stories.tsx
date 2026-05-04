import type { Meta, StoryObj } from '@storybook/react-vite'

import { NewsCard } from './NewsCard'

const meta = {
  title: 'Features/Dashboard/NewsCard',
  component: NewsCard,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NewsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Announcement: Story = {
  args: {
    item: {
      id: 1,
      tag: 'お知らせ',
      date: '2026年2月',
      title: 'マンガ作成前にネームが見れるようになりました',
    },
  },
}

export const NewFeature: Story = {
  args: {
    item: {
      id: 2,
      tag: '新機能',
      date: '2025年12月',
      title: 'キミガタリ コミック作成機能リリース',
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3">
      <NewsCard item={{ id: 1, tag: 'お知らせ', date: '2026年2月', title: 'マンガ作成前にネームが見れるようになりました' }} />
      <NewsCard item={{ id: 2, tag: '新機能', date: '2025年12月', title: 'キミガタリ コミック作成機能リリース' }} />
    </div>
  ),
}
