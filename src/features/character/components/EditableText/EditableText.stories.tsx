import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from './EditableText'

const meta = {
  title: 'Features/Character/EditableText',
  component: EditableText,
  parameters: { layout: 'padded' },
  args: {
    label: '名前',
    value: '',
    onSave: async () => {},
  },
} satisfies Meta<typeof EditableText>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('織田信長')
    return (
      <div className="w-80">
        <EditableText label="名前" value={value} onSave={async (v) => setValue(v)} />
      </div>
    )
  },
}

export const Multiline: Story = {
  render: () => {
    const [value, setValue] = useState('現代に転生した戦国武将。')
    return (
      <div className="w-80">
        <EditableText label="説明" value={value} multiline onSave={async (v) => setValue(v)} />
      </div>
    )
  },
}
