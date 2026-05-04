import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProtagonistCard } from './ProtagonistCard'
import type { Character } from '../../types'

const mockCharacter: Character = {
  id: 1,
  initials: '織',
  name: '織田信長',
  role: 'protagonist',
  isProtagonist: true,
  description: '転生した信長。',
  avatarColor: '#e11d48',
}

describe('ProtagonistCard', () => {
  it('character.name が表示される', () => {
    render(<ProtagonistCard character={mockCharacter} />)
    expect(screen.getByText('織田信長')).toBeInTheDocument()
  })
})
