import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('label が表示される', () => {
    render(<StatusBadge label="完了" />)
    expect(screen.getByText('完了')).toBeInTheDocument()
  })

  it('variant="success" のとき emerald 系クラスが付く', () => {
    render(<StatusBadge label="成功" variant="success" />)
    expect(screen.getByText('成功')).toHaveClass('text-emerald-600')
  })

  it('variant="warning" のとき amber 系クラスが付く', () => {
    render(<StatusBadge label="警告" variant="warning" />)
    expect(screen.getByText('警告')).toHaveClass('text-amber-600')
  })
})
