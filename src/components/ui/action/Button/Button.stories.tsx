import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Secondary: Story = {
  args: { children: 'キャンセル' },
}

export const Primary: Story = {
  args: { variant: 'primary', children: '保存する' },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: '送信中...', disabled: true },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button>キャンセル</Button>
      <Button variant="primary">保存する</Button>
      <Button variant="primary" disabled>送信中...</Button>
    </div>
  ),
}
