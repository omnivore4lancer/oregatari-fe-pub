import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DesignSection } from './DesignSection'
import type { CharacterDetail } from '../../types'

const mockCharacter: CharacterDetail = {
  id: 1,
  initials: '明',
  name: '明智',
  role: '敵対者',
  isProtagonist: false,
  description: '謎の存在',
  avatarColor: '#7c3aed',
  age: '28',
  gender: '男',
  overview: '謎の存在',
  appearance: '黒い着物',
  personality: '冷静',
  background: '武家出身',
  motivation: '報復',
  skills: ['剣術'],
}

describe('DesignSection', () => {
  it('character の appearance が表示される', () => {
    render(<DesignSection character={mockCharacter} />)
    expect(screen.getByText(/黒い着物/)).toBeInTheDocument()
  })

  it('imageUrl なしのとき EmptyState 相当が表示される', () => {
    render(<DesignSection character={{ ...mockCharacter, imageUrl: null }} />)
    expect(screen.getByText('三面図が設定されていません')).toBeInTheDocument()
  })

  it('onGenerate ボタンが表示される', () => {
    render(<DesignSection character={mockCharacter} onGenerate={vi.fn()} />)
    expect(screen.getByRole('button', { name: /三面図を生成/ })).toBeInTheDocument()
  })
})
