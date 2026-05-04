import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('open=false のとき何も描画されない', () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="削除の確認"
        message="本当に削除しますか？"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('open=true のとき title と message が表示される', () => {
    render(
      <ConfirmDialog
        open={true}
        title="削除の確認"
        message="本当に削除しますか？"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByText('削除の確認')).toBeInTheDocument()
    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument()
  })

  it('確認ボタンクリックで onConfirm が呼ばれる', async () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        open={true}
        title="削除の確認"
        message="本当に削除しますか？"
        confirmLabel="削除する"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: '削除する' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('キャンセルボタンクリックで onCancel が呼ばれる', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open={true}
        title="削除の確認"
        message="本当に削除しますか？"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('オーバーレイクリックで onCancel が呼ばれる', async () => {
    const onCancel = vi.fn()
    const { container } = render(
      <ConfirmDialog
        open={true}
        title="削除の確認"
        message="本当に削除しますか？"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )
    // 最外側の div（オーバーレイ）をクリック
    await userEvent.click(container.firstChild as Element)
    expect(onCancel).toHaveBeenCalled()
  })
})
