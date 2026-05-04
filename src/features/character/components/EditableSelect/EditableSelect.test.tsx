import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EditableSelect } from './EditableSelect'

describe('EditableSelect', () => {
  it('label が表示される', () => {
    render(<EditableSelect label="配役" value={null} onSave={vi.fn()} />)
    expect(screen.getByText('配役')).toBeInTheDocument()
  })

  it('クリックで編集モードになる', async () => {
    render(<EditableSelect label="配役" value={null} onSave={vi.fn()} />)
    await userEvent.click(screen.getByText('配役'))
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })
})
