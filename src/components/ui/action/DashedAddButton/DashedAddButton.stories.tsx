import type { Meta, StoryObj } from '@storybook/react-vite'

import { DashedAddButton } from './DashedAddButton'

const meta = {
  title: 'UI/DashedAddButton',
  component: DashedAddButton,
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof DashedAddButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: '新規エピソードを追加' },
}

export const Character: Story = {
  args: { label: '新しいキャラクター' },
}
