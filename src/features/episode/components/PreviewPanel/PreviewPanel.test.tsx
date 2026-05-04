import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PreviewPanel } from './PreviewPanel'

describe('PreviewPanel', () => {
  it('episode=null のとき「エピソードを選択すると...」が表示される', () => {
    render(<PreviewPanel episode={null} />)
    expect(screen.getByText(/エピソードを選択するとプレビューが表示されます/)).toBeInTheDocument()
  })
})
