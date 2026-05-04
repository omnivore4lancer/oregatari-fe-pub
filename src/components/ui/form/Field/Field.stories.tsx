import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from './Field'
import { inputClass } from '../formStyles'

const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '名前',
    children: <input className={inputClass} placeholder="例: 佐藤 太郎" />,
  },
}

export const Required: Story = {
  args: {
    label: 'タイトル',
    required: true,
    children: <input className={inputClass} placeholder="エピソードのタイトルを入力..." />,
  },
}
