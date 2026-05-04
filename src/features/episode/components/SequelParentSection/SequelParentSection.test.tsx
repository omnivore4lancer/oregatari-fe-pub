import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SequelParentSection } from './SequelParentSection'
import type { Episode } from '../../types'

const mockEpisodes: Episode[] = [
  {
    id: 1,
    number: 1,
    title: '信長SNSデビュー',
    status: 'unpublished',
    relation: 'standalone',
    description: '信長がSNSに初めて触れる話。',
    content: '',
    createdAt: '2026/04/22',
    generatingState: 'done',
    characterIds: [],
    inheritRelation: false,
    hasScenes: false,
  },
]

describe('SequelParentSection', () => {
  it('episodes のタイトルが表示される', () => {
    render(<SequelParentSection episodes={mockEpisodes} selectedId={null} onSelect={vi.fn()} />)
    expect(screen.getByText('信長SNSデビュー')).toBeInTheDocument()
  })

  it('クリックで onSelect が呼ばれる', async () => {
    const onSelect = vi.fn()
    render(<SequelParentSection episodes={mockEpisodes} selectedId={null} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('信長SNSデビュー'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
