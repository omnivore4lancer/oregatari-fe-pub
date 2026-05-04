import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { InheritRelationToggle } from './InheritRelationToggle'

const meta = {
  title: 'Features/Episode/InheritRelationToggle',
  component: InheritRelationToggle,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InheritRelationToggle>

export default meta
type Story = StoryObj<typeof meta>

export const On: Story = {
  args: { checked: true, onChange: () => {} },
}

export const Off: Story = {
  args: { checked: false, onChange: () => {} },
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return <InheritRelationToggle checked={checked} onChange={setChecked} />
  },
}
