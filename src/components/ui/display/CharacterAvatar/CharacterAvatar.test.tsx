import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CharacterAvatar } from './CharacterAvatar'

describe('CharacterAvatar', () => {
  it('imageUrl なしのとき initials が表示される', () => {
    render(<CharacterAvatar initials="AB" color="#8b5cf6" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('imageUrl があるとき img 要素が描画される', () => {
    render(<CharacterAvatar initials="AB" color="#8b5cf6" imageUrl="https://example.com/avatar.png" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('size="sm" のとき対応する CSS クラスが付く', () => {
    const { container } = render(<CharacterAvatar initials="AB" color="#8b5cf6" size="sm" />)
    expect(container.firstChild).toHaveClass('w-8')
    expect(container.firstChild).toHaveClass('h-8')
  })

  it('size="md" のとき対応する CSS クラスが付く', () => {
    const { container } = render(<CharacterAvatar initials="AB" color="#8b5cf6" size="md" />)
    expect(container.firstChild).toHaveClass('w-10')
    expect(container.firstChild).toHaveClass('h-10')
  })

  it('size="lg" のとき対応する CSS クラスが付く', () => {
    const { container } = render(<CharacterAvatar initials="AB" color="#8b5cf6" size="lg" />)
    expect(container.firstChild).toHaveClass('w-12')
    expect(container.firstChild).toHaveClass('h-12')
  })
})
