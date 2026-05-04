import type { Meta, StoryObj } from '@storybook/react-vite'

import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'UI/SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: '基本情報' },
}

export const WithIcon: Story = {
  args: {
    title: '詳細設定',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
      </svg>
    ),
  },
}

export const WithExtra: Story = {
  args: {
    title: 'スキル・能力',
    extra: <span className="text-[12px] text-[var(--text)]">3件</span>,
  },
}
