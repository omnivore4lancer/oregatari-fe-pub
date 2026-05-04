import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditingActions } from './EditingActions'

describe('EditingActions', () => {
  it('描画される（editing=false のとき編集ボタンが表示される）', () => {
    render(
      <EditingActions editing={false} onEdit={vi.fn()} onDone={vi.fn()} onCancel={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /編集/ })).toBeInTheDocument()
  })

  it('editing=true のとき完了・キャンセルボタンが表示される', () => {
    render(
      <EditingActions editing={true} onEdit={vi.fn()} onDone={vi.fn()} onCancel={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  })
})
