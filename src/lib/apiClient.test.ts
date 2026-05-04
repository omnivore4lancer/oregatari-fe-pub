import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from './apiClient'

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  describe('get', () => {
    it('成功時に JSON をパースして返す', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      } as Response)

      const result = await apiClient.get('/stories')
      expect(result).toEqual({ id: 1 })
    })

    it('/api プレフィックスを付けてリクエストする', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)

      await apiClient.get('/genres')
      expect(fetch).toHaveBeenCalledWith(
        '/api/genres',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    })

    it('非 ok レスポンスのとき error メッセージで throw する', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response)

      await expect(apiClient.get('/stories/999')).rejects.toThrow('Not found')
    })

    it('エラーレスポンスの JSON パースが失敗したとき HTTP ステータスで throw する', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error()),
      } as Response)

      await expect(apiClient.get('/stories')).rejects.toThrow('HTTP 500')
    })
  })

  describe('post', () => {
    it('method: POST と JSON body を送る', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      } as Response)

      await apiClient.post('/stories', { name: 'テスト' })
      expect(fetch).toHaveBeenCalledWith(
        '/api/stories',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'テスト' }),
        }),
      )
    })
  })

  describe('put', () => {
    it('method: PUT を送る', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      } as Response)

      await apiClient.put('/stories/1', { name: '更新' })
      expect(fetch).toHaveBeenCalledWith(
        '/api/stories/1',
        expect.objectContaining({
          method: 'PUT',
        }),
      )
    })
  })

  describe('delete', () => {
    it('method: DELETE を送る', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Deleted' }),
      } as Response)

      await apiClient.delete('/stories/1')
      expect(fetch).toHaveBeenCalledWith(
        '/api/stories/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      )
    })
  })
})
