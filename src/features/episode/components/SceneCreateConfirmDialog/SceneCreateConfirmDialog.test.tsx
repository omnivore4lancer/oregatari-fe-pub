import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SceneCreateConfirmDialog } from './SceneCreateConfirmDialog'

describe('SceneCreateConfirmDialog', () => {
  it('open=false のとき何も描画されない', () => {
    const { container } = render(
      <SceneCreateConfirmDialog open={false} episodeTitle="第1話" generating={false} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('open=true のとき episodeTitle が表示される', () => {
    render(
      <SceneCreateConfirmDialog open={true} episodeTitle="第1話：出会いの朝" generating={false} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    )
    expect(screen.getByText(/第1話：出会いの朝/)).toBeInTheDocument()
  })

  it('生成するボタンクリックで onConfirm が呼ばれる', async () => {
    const onConfirm = vi.fn()
    render(
      <SceneCreateConfirmDialog open={true} episodeTitle="第1話" generating={false} onConfirm={onConfirm} onCancel={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: '生成する' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
