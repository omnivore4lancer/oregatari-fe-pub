import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArchetypeRoleInfoModal } from './ArchetypeRoleInfoModal'

const meta = {
  title: 'Features/Character/ArchetypeRoleInfoModal',
  component: ArchetypeRoleInfoModal,
  parameters: { layout: 'centered' },
  args: { archetypeRole: 'MENTOR', onClose: () => {} },
} satisfies Meta<typeof ArchetypeRoleInfoModal>
export default meta
type Story = StoryObj<typeof meta>

export const Mentor: Story = {}
export const Shadow: Story = { args: { archetypeRole: 'SHADOW' } }
export const Shapeshifter: Story = { args: { archetypeRole: 'SHAPESHIFTER' } }
export const Herald: Story = { args: { archetypeRole: 'HERALD' } }
