import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProtagonistCard } from './ProtagonistCard'
import type { Character } from '../../types'

const mockCharacter: Character = {
  id: 1,
  initials: '織',
  name: '織田信長',
  role: 'protagonist',
  isProtagonist: true,
  description: '本能寺の変から数百年、現代に転生した信長。SNSが支配する世界で再び天下を狙う。',
  avatarColor: '#e11d48',
}

const meta = {
  title: 'Features/Character/ProtagonistCard',
  component: ProtagonistCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProtagonistCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { character: mockCharacter },
}

export const Clickable: Story = {
  args: { character: mockCharacter, onClick: () => {} },
}
