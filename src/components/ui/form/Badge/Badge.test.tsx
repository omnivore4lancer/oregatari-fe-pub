import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OptionalBadge, RequiredBadge } from './Badge'

describe('RequiredBadge', () => {
  it('「必須」を表示する', () => {
    render(<RequiredBadge />)
    expect(screen.getByText('必須')).toBeInTheDocument()
  })
})

describe('OptionalBadge', () => {
  it('「任意」を表示する', () => {
    render(<OptionalBadge />)
    expect(screen.getByText('任意')).toBeInTheDocument()
  })
})
