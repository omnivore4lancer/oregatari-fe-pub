import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { CharacterDetailModal } from './CharacterDetailModal'

vi.mock('../../../../contexts/ApiErrorContext', () => ({
  useApiError: () => ({ showError: vi.fn() }),
}))

const meta = {
  title: 'Features/Character/CharacterDetailModal',
  component: CharacterDetailModal,
  parameters: { layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <MemoryRouter><Story /></MemoryRouter>],
  args: { storyId: 1, characterId: null, onClose: () => {} },
} satisfies Meta<typeof CharacterDetailModal>
export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}
