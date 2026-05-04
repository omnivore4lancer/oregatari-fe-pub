import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EpisodeCard } from './EpisodeCard'
import type { Episode } from '../../types'

const mockEpisode: Episode = {
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
}

describe('EpisodeCard', () => {
  it('episode.title が表示される', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('信長SNSデビュー')).toBeInTheDocument()
  })

  it('episode.number が表示される', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })
})
