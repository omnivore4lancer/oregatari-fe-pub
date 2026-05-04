import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StepNav } from './StepNav'

describe('StepNav', () => {
  it('currentStep のラベルが accent クラスを持つ', () => {
    render(<StepNav currentStep={0} />)
    const activeLabel = screen.getByText('種類選択')
    expect(activeLabel).toHaveClass('text-[var(--accent)]')
  })
})
