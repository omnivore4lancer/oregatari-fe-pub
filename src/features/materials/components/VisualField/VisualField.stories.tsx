import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { VisualField } from './VisualField'

const meta = {
  title: 'Features/Materials/VisualField',
  component: VisualField,
  parameters: { layout: 'padded' },
  args: {
    label: '前景 左: 構造物',
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof VisualField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <VisualField label="前景 左: 構造物" value={value} onChange={setValue} />
    )
  },
}

export const WithNote: Story = {
  render: () => {
    const [value, setValue] = useState('テーブル\nソファ\n本棚')
    return (
      <VisualField
        label="前景 左: 家具"
        note="（1行につき1要素）"
        value={value}
        onChange={setValue}
        rows={4}
      />
    )
  },
}
