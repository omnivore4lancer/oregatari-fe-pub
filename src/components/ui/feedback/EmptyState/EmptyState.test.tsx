import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('message が表示される', () => {
    render(<EmptyState message="データがありません" />)
    expect(screen.getByText('データがありません')).toBeInTheDocument()
  })

  it('icon が渡されたとき描画される', () => {
    render(<EmptyState message="データがありません" icon={<span data-testid="icon">icon</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
