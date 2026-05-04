import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProtagonistFormSection } from './ProtagonistFormSection'
import type { CharacterDraft } from '../../types'

const emptyChar: CharacterDraft = {
  name: '',
  role: '',
  archetypeRole: '',
  gender: '',
  age: '',
  skills: '',
  overview: '',
  appearance: '',
  personality: '',
  motivation: '',
  background: '',
}

describe('ProtagonistFormSection', () => {
  it('「主人公」という見出しが表示される', () => {
    render(<ProtagonistFormSection value={emptyChar} onChange={vi.fn()} />)
    expect(screen.getByText('主人公')).toBeInTheDocument()
  })
})
