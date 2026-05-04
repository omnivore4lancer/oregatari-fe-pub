import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../action/Button/Button'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'エピソード一覧' },
}

export const WithDescription: Story = {
  args: {
    title: '新規キャラクター作成',
    description: 'キャラクターの基本情報と詳細を入力してください。',
  },
}

export const WithBack: Story = {
  args: {
    title: 'プロフィール編集',
    onBack: () => {},
  },
}

export const WithActions: Story = {
  args: {
    title: 'エピソード一覧',
    titleExtra: (
      <span className="text-[12px] text-[var(--text)] bg-gray-100 px-2 py-0.5 rounded-full">
        全3話
      </span>
    ),
    actions: <Button variant="primary">新規エピソード</Button>,
  },
}

export const Full: Story = {
  args: {
    title: 'プロフィール編集',
    description: 'キャラクターの基本情報と詳細を入力してください。',
    onBack: () => {},
    actions: (
      <>
        <Button>キャンセル</Button>
        <Button variant="primary">保存する</Button>
      </>
    ),
  },
}
