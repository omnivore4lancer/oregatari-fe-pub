import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DashedAddButton } from './DashedAddButton'

describe('DashedAddButton', () => {
  it('label が表示される', () => {
    render(<DashedAddButton label="追加" />)
    expect(screen.getByRole('button', { name: /追加/ })).toBeInTheDocument()
  })

  it('クリックで onClick が呼ばれる', async () => {
    const onClick = vi.fn()
    render(<DashedAddButton label="追加" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
