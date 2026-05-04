import { describe, expect, it } from 'vitest'

import type { CharacterResponse } from './characterApi'
import { toCharacter, toCharacterDetail } from './characterApi'

const base: CharacterResponse = {
  id: 3,
  storyId: 1,
  isProtagonist: false,
  name: '織田信長',
  role: '主人公',
  archetypeRole: null,
  age: '40代',
  gender: '男性',
  overview: '天下布武を掲げた武将',
  appearance: '甲冑姿',
  personality: '冷徹で野心家',
  motivation: '天下統一',
  background: '尾張出身',
  skills: ['剣術', '戦略'],
  avatarColor: 'bg-slate-700',
  imageUrl: null,
  createdAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
}

describe('toCharacter', () => {
  it('id を number のまま返す', () => {
    expect(toCharacter(base).id).toBe(3)
  })

  it('initials を name の先頭文字から生成する', () => {
    expect(toCharacter(base).initials).toBe('織')
  })

  it('description は overview をそのまま使う', () => {
    expect(toCharacter(base).description).toBe('天下布武を掲げた武将')
  })

  it('overview が null のとき description は空文字', () => {
    expect(toCharacter({ ...base, overview: null }).description).toBe('')
  })

  it('avatarColor を引き継ぐ', () => {
    expect(toCharacter(base).avatarColor).toBe('bg-slate-700')
  })

  it('avatarColor が null のとき id に基づくフォールバックカラーを返す', () => {
    const result = toCharacter({ ...base, avatarColor: null })
    expect(result.avatarColor).toMatch(/^#/)
  })

  it('id が異なるとフォールバックカラーが変わる場合がある', () => {
    const c1 = toCharacter({ ...base, id: 0, avatarColor: null })
    const c2 = toCharacter({ ...base, id: 1, avatarColor: null })
    // id % colors.length が異なれば色が変わる（0と1は必ず異なる）
    expect(c1.avatarColor).not.toBe(c2.avatarColor)
  })
})

describe('toCharacterDetail', () => {
  it('toCharacter の全フィールドを含む', () => {
    const char = toCharacter(base)
    const detail = toCharacterDetail(base)
    expect(detail.id).toBe(char.id)
    expect(detail.name).toBe(char.name)
  })

  it('skills 配列をそのまま持つ', () => {
    expect(toCharacterDetail(base).skills).toEqual(['剣術', '戦略'])
  })

  it('null フィールドは空文字に変換される', () => {
    const detail = toCharacterDetail({
      ...base,
      appearance: null,
      personality: null,
      motivation: null,
      background: null,
    })
    expect(detail.appearance).toBe('')
    expect(detail.personality).toBe('')
    expect(detail.motivation).toBe('')
    expect(detail.background).toBe('')
  })

  it('age・gender が null のとき空文字', () => {
    const detail = toCharacterDetail({ ...base, age: null, gender: null })
    expect(detail.age).toBe('')
    expect(detail.gender).toBe('')
  })
})
