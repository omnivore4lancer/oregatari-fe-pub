import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { InheritRelationToggle } from './InheritRelationToggle'

describe('InheritRelationToggle', () => {
  it('「人間関係を引き継ぐ」が表示される', () => {
    render(<InheritRelationToggle checked={false} onChange={vi.fn()} />)
    expect(screen.getByText('人間関係を引き継ぐ')).toBeInTheDocument()
  })

  it('トグルクリックで onChange が呼ばれる', async () => {
    const onChange = vi.fn()
    render(<InheritRelationToggle checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
