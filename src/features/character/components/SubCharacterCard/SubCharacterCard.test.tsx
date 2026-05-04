import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubCharacterCard } from './SubCharacterCard'
import type { Character } from '../../types'

const mockCharacter: Character = {
  id: 2,
  initials: '胡',
  name: '胡蝶',
  role: 'ヒロイン',
  isProtagonist: false,
  description: 'シンガーソングライター。',
  avatarColor: '#7c3aed',
}

describe('SubCharacterCard', () => {
  it('character.name が表示される', () => {
    render(<SubCharacterCard character={mockCharacter} />)
    expect(screen.getByText('胡蝶')).toBeInTheDocument()
  })
})
