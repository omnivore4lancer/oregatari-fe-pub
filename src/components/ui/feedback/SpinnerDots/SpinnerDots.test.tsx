import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SpinnerDots } from './SpinnerDots'

describe('SpinnerDots', () => {
  it('3つのドット span が描画される', () => {
    const { container } = render(<SpinnerDots />)
    // animate-bounce クラスを持つ span を数える
    const dots = container.querySelectorAll('span.animate-bounce')
    expect(dots).toHaveLength(3)
  })
})
