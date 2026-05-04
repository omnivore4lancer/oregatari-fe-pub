import type { Meta, StoryObj } from '@storybook/react-vite'

import { ConfirmDialog } from './ConfirmDialog'

const meta = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Delete: Story = {
  args: {
    title: 'エピソードを削除',
    message: '「第1話 始まりの朝」を削除しますか？この操作は取り消せません。',
    confirmLabel: '削除',
  },
}

export const CustomLabel: Story = {
  args: {
    title: 'キャラクターを削除',
    message: '「田中 太郎」を削除しますか？この操作は取り消せません。',
    confirmLabel: '削除する',
  },
}
