import type { Meta, StoryObj } from '@storybook/react-vite'

import { CharacterAvatar } from './CharacterAvatar'

const meta = {
  title: 'UI/CharacterAvatar',
  component: CharacterAvatar,
  parameters: { layout: 'centered' },
  args: { initials: '田', color: '#7c3aed' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof CharacterAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { initials: '山', color: '#db2777', size: 'sm' },
}

export const Large: Story = {
  args: { initials: '鈴', color: '#0891b2', size: 'lg' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CharacterAvatar initials="小" color="#7c3aed" size="sm" />
      <CharacterAvatar initials="中" color="#7c3aed" size="md" />
      <CharacterAvatar initials="大" color="#7c3aed" size="lg" />
    </div>
  ),
}
