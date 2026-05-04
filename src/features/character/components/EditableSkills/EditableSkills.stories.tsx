import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableSkills } from './EditableSkills'

const meta = {
  title: 'Features/Character/EditableSkills',
  component: EditableSkills,
  parameters: { layout: 'padded' },
  args: {
    skills: [],
    onSave: async () => {},
  },
} satisfies Meta<typeof EditableSkills>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [skills, setSkills] = useState<string[]>([])
    return (
      <div className="w-80">
        <EditableSkills skills={skills} onSave={async (s) => setSkills(s)} />
      </div>
    )
  },
}

export const WithSkills: Story = {
  render: () => {
    const [skills, setSkills] = useState(['剣術', '謀略', '洞察力'])
    return (
      <div className="w-80">
        <EditableSkills skills={skills} onSave={async (s) => setSkills(s)} />
      </div>
    )
  },
}
