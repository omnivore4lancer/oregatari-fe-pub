import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EpisodeTypeCard } from './EpisodeTypeCard'

describe('EpisodeTypeCard', () => {
  it('title が表示される', () => {
    render(
      <EpisodeTypeCard icon={null} title="独立話" description="独立したエピソード" selected={false} onSelect={vi.fn()} />,
    )
    expect(screen.getByText('独立話')).toBeInTheDocument()
  })

  it('description が表示される', () => {
    render(
      <EpisodeTypeCard icon={null} title="独立話" description="独立したエピソード" selected={false} onSelect={vi.fn()} />,
    )
    expect(screen.getByText('独立したエピソード')).toBeInTheDocument()
  })

  it('クリックで onSelect が呼ばれる', async () => {
    const onSelect = vi.fn()
    render(
      <EpisodeTypeCard icon={null} title="独立話" description="独立したエピソード" selected={false} onSelect={onSelect} />,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('selected のとき accent border クラスが付く', () => {
    render(
      <EpisodeTypeCard icon={null} title="独立話" description="独立したエピソード" selected={true} onSelect={vi.fn()} />,
    )
    expect(screen.getByRole('button')).toHaveClass('border-[var(--accent)]')
  })
})
