import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/msw/server'
import type { paths } from '../../../types/api'
import { useCharacters } from './useCharacters'

type CharacterResponse =
  paths['/stories/{storyId}/characters']['get']['responses']['200']['content']['application/json'][number]

const fixture: CharacterResponse[] = [
  {
    id: 1,
    storyId: 1,
    isProtagonist: true,
    name: '主人公',
    role: 'hero',
    archetypeRole: null,
    age: '17',
    gender: '男',
    overview: '物語の主人公',
    appearance: null,
    personality: null,
    motivation: null,
    background: null,
    skills: [],
    avatarColor: null,
    imageUrl: null,
    faceImageUrl: null,
    imagePrompt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useCharacters（MSW 結合テスト）', () => {
  it('API レスポンスをキャラクター一覧に変換して返す', async () => {
    server.use(
      http.get('/api/stories/1/characters', () => HttpResponse.json(fixture)),
    )

    const { result } = renderHook(() => useCharacters(1), { wrapper })

    await waitFor(() => expect(result.current).toHaveLength(1))

    expect(result.current[0]).toMatchObject({
      id: 1,
      name: '主人公',
      isProtagonist: true,
      age: '17',
      gender: '男',
      overview: '物語の主人公',
    })
  })

  it('複数キャラクターを全件返す', async () => {
    const fixtures: CharacterResponse[] = [
      { ...fixture[0], id: 1, name: '主人公' },
      { ...fixture[0], id: 2, name: '師匠', isProtagonist: false },
    ]
    server.use(
      http.get('/api/stories/1/characters', () => HttpResponse.json(fixtures)),
    )

    const { result } = renderHook(() => useCharacters(1), { wrapper })

    await waitFor(() => expect(result.current).toHaveLength(2))
    expect(result.current.map((c) => c.name)).toEqual(['主人公', '師匠'])
  })

  it('空配列のとき空を返す', async () => {
    server.use(
      http.get('/api/stories/1/characters', () => HttpResponse.json([])),
    )

    const { result } = renderHook(() => useCharacters(1), { wrapper })

    await waitFor(() => expect(result.current).toBeDefined())
    expect(result.current).toHaveLength(0)
  })
})
