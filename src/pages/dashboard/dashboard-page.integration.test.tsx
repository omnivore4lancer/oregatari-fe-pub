import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ApiErrorProvider } from '../../contexts/ApiErrorContext'
import { ToastProvider } from '../../contexts/ToastContext'
import { server } from '../../test/msw/server'
import type { paths } from '../../types/api'
import DashboardPage from './dashboard-page'

type StoryResponse =
  paths['/stories']['get']['responses']['200']['content']['application/json'][number]

const fixture: StoryResponse = {
  id: 1,
  userId: null,
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
  coverImageUrl: null,
  previewImages: [],
  createdAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <ApiErrorProvider>
        <ToastProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </ToastProvider>
      </ApiErrorProvider>
    </QueryClientProvider>
  )
}

function renderPage() {
  return render(<DashboardPage />, { wrapper })
}

describe('DashboardPage', () => {
  it('ロード完了後「新しい作品を登録」リンクが表示される', async () => {
    server.use(http.get('/api/stories', () => HttpResponse.json([])))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('新しい作品を登録')).toBeInTheDocument()
    })
  })

  it('「今日」セクションが読み込み後に表示される', async () => {
    server.use(http.get('/api/stories', () => HttpResponse.json([])))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('今日')).toBeInTheDocument()
    })
  })

  it('API が空配列を返すとき「新しい作品を登録」のみ表示される', async () => {
    server.use(http.get('/api/stories', () => HttpResponse.json([])))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('新しい作品を登録')).toBeInTheDocument()
    })
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('ストーリー名が表示される', async () => {
    server.use(http.get('/api/stories', () => HttpResponse.json([fixture])))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('テスト物語')).toBeInTheDocument()
    })
  })

  it('ストーリーが複数のとき全件表示される', async () => {
    const fixtures: StoryResponse[] = [
      { ...fixture, id: 1, name: '物語A' },
      { ...fixture, id: 2, name: '物語B' },
    ]
    server.use(http.get('/api/stories', () => HttpResponse.json(fixtures)))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('物語A')).toBeInTheDocument()
      expect(screen.getByText('物語B')).toBeInTheDocument()
    })
  })
})
