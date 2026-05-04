import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { EditingActions } from './EditingActions'

const meta = {
  title: 'Features/Story/EditingActions',
  component: EditingActions,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EditingActions>

export default meta
type Story = StoryObj<typeof meta>

export const Viewing: Story = {
  args: { editing: false, onEdit: () => {}, onDone: () => {}, onCancel: () => {} },
}

export const Editing: Story = {
  args: { editing: true, onEdit: () => {}, onDone: () => {}, onCancel: () => {} },
}

export const Interactive: Story = {
  render: () => {
    const [editing, setEditing] = useState(false)
    return (
      <div className="flex items-center gap-2">
        <EditingActions
          editing={editing}
          onEdit={() => setEditing(true)}
          onDone={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  },
}
