import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CharacterSelectSection } from './CharacterSelectSection'
import type { CharacterDetail } from '../../../character/types'

const mockCharacters: CharacterDetail[] = [
  {
    id: 1,
    initials: '織',
    name: '織田信長',
    role: 'protagonist',
    isProtagonist: true,
    description: '転生した信長。',
    avatarColor: '#e11d48',
    age: '28',
    gender: '男',
    overview: '転生した信長。',
    appearance: '黒髪短髪。',
    personality: '決断力がある。',
    background: '戦国時代から転生。',
    motivation: '天下統一。',
    skills: ['戦略立案'],
  },
]

describe('CharacterSelectSection', () => {
  it('characters が空のとき何も表示されない（リストが空）', () => {
    const { container } = render(
      <CharacterSelectSection characters={[]} selectedIds={[]} onChange={vi.fn()} />,
    )
    expect(container.querySelectorAll('label')).toHaveLength(0)
  })

  it('キャラクターの名前が表示される', () => {
    render(
      <CharacterSelectSection characters={mockCharacters} selectedIds={[]} onChange={vi.fn()} />,
    )
    expect(screen.getByText('織田信長')).toBeInTheDocument()
  })
})
