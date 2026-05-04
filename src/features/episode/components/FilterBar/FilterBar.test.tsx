import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  it('フィルタボタンが複数表示される', () => {
    render(<FilterBar active="all" onChange={vi.fn()} />)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
  })

  it('クリックで onChange が呼ばれる', async () => {
    const onChange = vi.fn()
    render(<FilterBar active="all" onChange={onChange} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
