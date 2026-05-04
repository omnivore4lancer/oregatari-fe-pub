import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InfoGrid } from './InfoGrid'
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
  overview: '役没した物語の障害として現れる存在。',
  appearance: '黒い着物',
  personality: '冷静で計算高い。',
  background: '武家の出身。',
  motivation: '天下布武への報復。',
  skills: ['剣術', '謀略'],
}

describe('InfoGrid', () => {
  it('character の overview が表示される', () => {
    render(<InfoGrid character={mockCharacter} />)
    expect(screen.getByText('役没した物語の障害として現れる存在。')).toBeInTheDocument()
  })

  it('skills が表示される', () => {
    render(<InfoGrid character={mockCharacter} />)
    expect(screen.getByText('剣術')).toBeInTheDocument()
    expect(screen.getByText('謀略')).toBeInTheDocument()
  })
})
