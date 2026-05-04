import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SectionHeader } from './SectionHeader'

describe('SectionHeader', () => {
  it('title が表示される', () => {
    render(<SectionHeader title="プロフィール" />)
    expect(screen.getByRole('heading', { name: 'プロフィール' })).toBeInTheDocument()
  })

  it('icon が渡されたとき描画される', () => {
    render(<SectionHeader title="プロフィール" icon={<span data-testid="icon">icon</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('extra が渡されたとき描画される', () => {
    render(<SectionHeader title="プロフィール" extra={<button>追加</button>} />)
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })
})
