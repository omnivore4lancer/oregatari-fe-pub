import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GroupPanel } from './GroupPanel'
import type { GroupItem } from './GroupPanel'

const groups: GroupItem[] = [
  { id: 'all', label: 'すべて' },
  { id: 'bg', label: '背景' },
]

describe('GroupPanel', () => {
  it('グループ名が表示される', () => {
    render(<GroupPanel groups={groups} activeGroup="all" onSelectGroup={vi.fn()} />)
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('背景')).toBeInTheDocument()
  })
})
