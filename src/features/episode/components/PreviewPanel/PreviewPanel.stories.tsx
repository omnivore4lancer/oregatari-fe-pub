import type { Meta, StoryObj } from '@storybook/react-vite'

import { PreviewPanel } from './PreviewPanel'

const meta = {
  title: 'Features/Episode/PreviewPanel',
  component: PreviewPanel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PreviewPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { episode: null },
}

export const Generating: Story = {
  args: {
    episode: {
      id: 1,
      number: 1,
      title: '信長SNSデビュー',
      status: '未公開',
      relation: '単独',
      description: 'SNSの誹謗中傷に悩む胡蝶の姿を見て...',
      createdAt: '2026/04/22',
      generatingState: 'generating',
      characterIds: [],
      inheritRelation: true,
    },
  },
}

export const Done: Story = {
  args: {
    episode: {
      id: 2,
      number: 2,
      title: '醒い',
      status: '未公開',
      relation: '続編',
      description: '信長がSNSで胡蝶のバッシャーを成敗したことで、胡蝶の炎上は一時収束する。しかし明智の次の一手が静かに動き始め...',
      createdAt: '2026/04/23',
      generatingState: 'done',
      characterIds: [],
      inheritRelation: true,
    },
  },
}
