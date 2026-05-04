import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VisualField } from './VisualField'

describe('VisualField', () => {
  it('label が表示される', () => {
    render(<VisualField label="前景 左: 構造物" value="" onChange={vi.fn()} />)
    expect(screen.getByText('前景 左: 構造物')).toBeInTheDocument()
  })
})
