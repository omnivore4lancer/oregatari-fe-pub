import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableSelect } from './EditableSelect'
import type { ArchetypeRole } from '../../types'

const meta = {
  title: 'Features/Character/EditableSelect',
  component: EditableSelect,
  parameters: { layout: 'padded' },
  args: {
    label: '配役',
    value: null,
    onSave: async () => {},
  },
} satisfies Meta<typeof EditableSelect>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<ArchetypeRole | null>(null)
    return (
      <div className="w-80">
        <EditableSelect label="配役" value={value} onSave={async (v) => setValue(v || null)} />
      </div>
    )
  },
}
