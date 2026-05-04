import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SectionCard } from './SectionCard'

describe('SectionCard', () => {
  it('title が表示される', () => {
    render(<SectionCard title="基本情報"><p>内容</p></SectionCard>)
    expect(screen.getByText('基本情報')).toBeInTheDocument()
  })

  it('children が描画される', () => {
    render(<SectionCard title="基本情報"><p data-testid="content">内容</p></SectionCard>)
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('headerActions が渡されたとき描画される', () => {
    render(
      <SectionCard title="基本情報" headerActions={<button>編集</button>}>
        <p>内容</p>
      </SectionCard>,
    )
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
  })
})
