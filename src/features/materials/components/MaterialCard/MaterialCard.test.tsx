import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MaterialCard } from './MaterialCard'

describe('MaterialCard', () => {
  it('material.name が表示される', () => {
    render(<MaterialCard title="胡蝶の部屋" date="2026/04/22" />)
    expect(screen.getByText('胡蝶の部屋')).toBeInTheDocument()
  })
})
