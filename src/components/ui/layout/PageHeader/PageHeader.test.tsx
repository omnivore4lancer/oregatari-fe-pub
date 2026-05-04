import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('title が表示される', () => {
    render(<PageHeader title="キャラクター一覧" />)
    expect(screen.getByRole('heading', { name: 'キャラクター一覧' })).toBeInTheDocument()
  })

  it('onBack が渡されたときボタンが表示される', () => {
    render(<PageHeader title="詳細" onBack={vi.fn()} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('onBack なしのときボタンが表示されない', () => {
    render(<PageHeader title="詳細" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('onBack ボタンをクリックすると onBack が呼ばれる', async () => {
    const onBack = vi.fn()
    render(<PageHeader title="詳細" onBack={onBack} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('description が表示される', () => {
    render(<PageHeader title="詳細" description="キャラクターの詳細情報です" />)
    expect(screen.getByText('キャラクターの詳細情報です')).toBeInTheDocument()
  })

  it('actions が描画される', () => {
    render(<PageHeader title="詳細" actions={<button>保存</button>} />)
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })
})
