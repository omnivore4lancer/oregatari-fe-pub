import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CoverImagePreview } from './CoverImagePreview'

describe('CoverImagePreview', () => {
  it('生成中はスピナーを表示する', () => {
    render(<CoverImagePreview isGenerating imageUrl={null} />)
    expect(screen.getByText('生成中...')).toBeInTheDocument()
  })

  it('imageUrl がある場合は画像を表示する', () => {
    render(<CoverImagePreview isGenerating={false} imageUrl="https://example.com/cover.jpg" />)
    expect(screen.getByAltText('カバー画像')).toBeInTheDocument()
  })

  it('未生成時はプレースホルダーテキストを表示する', () => {
    render(<CoverImagePreview isGenerating={false} imageUrl={null} />)
    expect(screen.getByText(/生成後に/)).toBeInTheDocument()
  })
})
