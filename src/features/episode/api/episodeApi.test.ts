import { describe, expect, it } from 'vitest'

import type { EpisodeResponse } from './episodeApi'
import { toEpisode } from './episodeApi'

const base: EpisodeResponse = {
  id: 1,
  storyId: 1,
  number: 1,
  title: '第1話',
  description: 'あらすじ',
  content: null,
  status: 'UNPUBLISHED',
  relation: 'STANDALONE',
  generatingState: 'DONE',
  parentId: null,
  inheritRelation: true,
  characters: [],
  _count: { pages: 0 },
  createdAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
}

describe('toEpisode - status マッピング', () => {
  it('UNPUBLISHED → unpublished', () => {
    expect(toEpisode(base).status).toBe('unpublished')
  })

  it('PUBLISHED → published', () => {
    expect(toEpisode({ ...base, status: 'PUBLISHED' }).status).toBe('published')
  })
})

describe('toEpisode - relation マッピング', () => {
  it('STANDALONE → standalone', () => {
    expect(toEpisode(base).relation).toBe('standalone')
  })

  it('SEQUEL → sequel', () => {
    expect(toEpisode({ ...base, relation: 'SEQUEL' }).relation).toBe('sequel')
  })

  it('PARALLEL → parallel', () => {
    expect(toEpisode({ ...base, relation: 'PARALLEL' }).relation).toBe('parallel')
  })
})

describe('toEpisode - generatingState マッピング', () => {
  it('DONE → done', () => {
    expect(toEpisode(base).generatingState).toBe('done')
  })

  it('GENERATING → generating', () => {
    expect(toEpisode({ ...base, generatingState: 'GENERATING' }).generatingState).toBe('generating')
  })
})

describe('toEpisode - フィールド変換', () => {
  it('createdAt を YYYY/MM/DD 形式に変換する', () => {
    expect(toEpisode(base).createdAt).toBe('2026/04/25')
  })

  it('description が null のとき空文字', () => {
    expect(toEpisode({ ...base, description: null }).description).toBe('')
  })

  it('id・number・title はそのまま引き継ぐ', () => {
    const result = toEpisode(base)
    expect(result.id).toBe(1)
    expect(result.number).toBe(1)
    expect(result.title).toBe('第1話')
  })
})
