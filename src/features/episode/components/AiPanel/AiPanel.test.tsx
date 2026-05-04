import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AiPanel } from './AiPanel'

describe('AiPanel', () => {
  it('「AI編集者」が表示される', () => {
    render(<AiPanel />)
    expect(screen.getByText('AI編集者')).toBeInTheDocument()
  })
})
