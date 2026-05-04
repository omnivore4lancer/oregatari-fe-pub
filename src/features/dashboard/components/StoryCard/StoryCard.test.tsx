import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { StoryCard } from './StoryCard'

describe('StoryCard', () => {
  it('story.title が表示される', () => {
    render(
      <MemoryRouter>
        <StoryCard
          story={{ id: 1, title: 'のぶにゃが', badge: 'ファンタジー', age: '1日前', coverImageUrl: null, previewImages: [] }}
          onDelete={vi.fn()}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('のぶにゃが')).toBeInTheDocument()
  })
})
