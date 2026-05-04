import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EpisodeDetailSection } from './EpisodeDetailSection'

describe('EpisodeDetailSection', () => {
  it('タイトル入力欄が表示される', () => {
    render(
      <EpisodeDetailSection
        title=""
        summary=""
        content=""
        onTitleChange={vi.fn()}
        onSummaryChange={vi.fn()}
        onContentChange={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText('エピソードのタイトルを入力...')).toBeInTheDocument()
  })

  it('概要入力欄が表示される', () => {
    render(
      <EpisodeDetailSection
        title=""
        summary=""
        content=""
        onTitleChange={vi.fn()}
        onSummaryChange={vi.fn()}
        onContentChange={vi.fn()}
      />,
    )
    expect(screen.getByPlaceholderText(/このエピソードの概要を入力/)).toBeInTheDocument()
  })
})
