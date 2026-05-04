import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { StoryResponse } from '../../features/story/api/storyApi'
import * as storyApiModule from '../../features/story/api/storyApi'
import DashboardPage from './dashboard-page'

vi.mock('../../features/story/api/storyApi', async (importOriginal) => {
  const actual = await importOriginal<typeof storyApiModule>()
  return {
    ...actual,
    storyApi: {
      ...actual.storyApi,
      getStories: vi.fn(),
    },
  }
})

const mockStory: StoryResponse = {
  id: 1,
  name: 'テスト物語',
  genres: [{ id: 1, name: 'ファンタジー' }],
  worldSetting: '魔法のある世界',
  era: 'MODERN',
  additionalElements: null,
  eraBg: null,
  intro: null,
  dev: null,
  climax: null,
  conclusion: null,
  createdAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
}

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(storyApiModule.storyApi.getStories).mockResolvedValue([])
  })

  it('「新しい作品を登録」リンクが表示される', () => {
    renderPage()
    expect(screen.getByText('新しい作品を登録')).toBeInTheDocument()
  })

  it('「今日」セクションが読み込み後に表示される', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('今日')).toBeInTheDocument()
    })
  })

  it('API が空配列を返すとき空メッセージが表示される', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/物語がありません/)).toBeInTheDocument()
    })
  })

  it('ストーリー名が表示される', async () => {
    vi.mocked(storyApiModule.storyApi.getStories).mockResolvedValue([mockStory])
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('テスト物語')).toBeInTheDocument()
    })
  })

  it('ストーリーが複数のとき全件表示される', async () => {
    const stories: StoryResponse[] = [
      { ...mockStory, id: 1, name: '物語A' },
      { ...mockStory, id: 2, name: '物語B' },
    ]
    vi.mocked(storyApiModule.storyApi.getStories).mockResolvedValue(stories)
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('物語A')).toBeInTheDocument()
      expect(screen.getByText('物語B')).toBeInTheDocument()
    })
  })
})
