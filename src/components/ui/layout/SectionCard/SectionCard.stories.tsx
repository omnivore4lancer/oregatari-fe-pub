import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../action/Button/Button'
import { SectionCard } from './SectionCard'

const meta = {
  title: 'UI/SectionCard',
  component: SectionCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '時代背景',
    children: <p className="text-[13px] text-[var(--text)] leading-relaxed m-0">現代の東京を舞台にした物語。</p>,
  },
}

export const WithActions: Story = {
  args: {
    title: '歴史ストーリー',
    headerActions: <Button className="text-[12px]">編集</Button>,
    children: <p className="text-[13px] text-[var(--text)] leading-relaxed m-0">導入・展開・クライマックス・結末の4部構成。</p>,
  },
}
