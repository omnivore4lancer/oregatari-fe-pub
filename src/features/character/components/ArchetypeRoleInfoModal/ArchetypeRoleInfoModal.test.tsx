import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ArchetypeRoleInfoModal } from './ArchetypeRoleInfoModal'

describe('ArchetypeRoleInfoModal', () => {
  it('archetypeRole=null のとき何も描画されない', () => {
    const { container } = render(<ArchetypeRoleInfoModal archetypeRole={null} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('archetypeRole 指定時に label が表示される', () => {
    render(<ArchetypeRoleInfoModal archetypeRole="MENTOR" onClose={vi.fn()} />)
    expect(screen.getByText('メンター（賢者）')).toBeInTheDocument()
  })

  it('✕クリックで onClose が呼ばれる', async () => {
    const onClose = vi.fn()
    render(<ArchetypeRoleInfoModal archetypeRole="SHADOW" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
