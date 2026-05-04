import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ToggleButton } from './ToggleButton'

describe('ToggleButton', () => {
  it('label が表示される', () => {
    render(<ToggleButton label="SF" selected={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'SF' })).toBeInTheDocument()
  })

  it('selected=true のとき accent 系クラスが付く', () => {
    render(<ToggleButton label="SF" selected={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveClass('border-[var(--accent)]')
  })

  it('クリックで onClick が呼ばれる', async () => {
    const onClick = vi.fn()
    render(<ToggleButton label="SF" selected={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
