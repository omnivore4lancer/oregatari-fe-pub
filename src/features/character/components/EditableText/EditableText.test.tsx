import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EditableText } from './EditableText'

describe('EditableText', () => {
  it('label が表示される', () => {
    render(<EditableText label="名前" value="織田信長" onSave={vi.fn()} />)
    expect(screen.getByText('名前')).toBeInTheDocument()
  })

  it('value が表示される', () => {
    render(<EditableText label="名前" value="織田信長" onSave={vi.fn()} />)
    expect(screen.getByText('織田信長')).toBeInTheDocument()
  })

  it('クリックで編集モードになる', async () => {
    render(<EditableText label="名前" value="織田信長" onSave={vi.fn()} />)
    await userEvent.click(screen.getByText('織田信長'))
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })
})
