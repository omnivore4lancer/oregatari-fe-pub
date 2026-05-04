import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EditableSkills } from './EditableSkills'

describe('EditableSkills', () => {
  it('skills が表示される', () => {
    render(<EditableSkills skills={['剣術', '謀略']} onSave={vi.fn()} />)
    expect(screen.getByText('剣術')).toBeInTheDocument()
    expect(screen.getByText('謀略')).toBeInTheDocument()
  })

  it('スキルなしのとき「未設定」が表示される', () => {
    render(<EditableSkills skills={[]} onSave={vi.fn()} />)
    expect(screen.getByText('未設定')).toBeInTheDocument()
  })

  it('クリックで編集モードになる', async () => {
    render(<EditableSkills skills={['剣術']} onSave={vi.fn()} />)
    await userEvent.click(screen.getByText('剣術'))
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })
})
