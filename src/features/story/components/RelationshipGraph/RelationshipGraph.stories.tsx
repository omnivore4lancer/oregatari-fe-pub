import type { Meta, StoryObj } from '@storybook/react-vite'

import { RelationshipGraph } from './RelationshipGraph'

const meta = {
  title: 'Features/Story/RelationshipGraph',
  component: RelationshipGraph,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RelationshipGraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    characters: [
      { id: 1, initials: '明', name: '明智（あけち）', role: '役没・物語の障害', isProtagonist: true, archetypeRole: null },
      { id: 2, initials: '織', name: '織田信長', role: '主人公・転生者', isProtagonist: false, archetypeRole: 'SHADOW' },
      { id: 3, initials: '木', name: '木下藤吉郎', role: '盟友・協力者', isProtagonist: false, archetypeRole: 'SHAPESHIFTER' },
      { id: 4, initials: '豊', name: '豊臣秀長', role: '側近・補佐役', isProtagonist: false, archetypeRole: 'HERALD' },
      { id: 5, initials: '徳', name: '徳川家康', role: '同盟者', isProtagonist: false, archetypeRole: 'MENTOR' },
    ],
  },
}

export const Empty: Story = {
  args: { characters: [] },
}

