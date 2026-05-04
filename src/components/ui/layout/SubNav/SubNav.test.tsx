import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubNav } from './SubNav'

describe('SubNav', () => {
  it('nav 要素が描画される', () => {
    const { container } = render(<SubNav />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })
})
