import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StepBadge } from './StepBadge'

describe('StepBadge', () => {
  it('n が表示される', () => {
    render(<StepBadge n="1" />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
