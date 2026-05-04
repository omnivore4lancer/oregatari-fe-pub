import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './Select'

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = ['新しい順', '古い順', '名前順']

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(OPTIONS[0])
    return <Select value={value} onChange={setValue} options={OPTIONS} />
  },
}
