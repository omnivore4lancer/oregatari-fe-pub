import { describe, expect, it } from 'vitest'

import { ERA_LABEL, LABEL_TO_ERA } from './storyApi'

describe('ERA_LABEL', () => {
  it('MODERN → 現代', () => {
    expect(ERA_LABEL.MODERN).toBe('現代')
  })

  it('MEDIEVAL → 古代/中世', () => {
    expect(ERA_LABEL.MEDIEVAL).toBe('古代/中世')
  })

  it('FUTURE → 未来/SF', () => {
    expect(ERA_LABEL.FUTURE).toBe('未来/SF')
  })
})

describe('LABEL_TO_ERA', () => {
  it('現代 → MODERN', () => {
    expect(LABEL_TO_ERA['現代']).toBe('MODERN')
  })

  it('古代/中世 → MEDIEVAL', () => {
    expect(LABEL_TO_ERA['古代/中世']).toBe('MEDIEVAL')
  })

  it('未来/SF → FUTURE', () => {
    expect(LABEL_TO_ERA['未来/SF']).toBe('FUTURE')
  })

  it('ERA_LABEL と相互変換できる（全キー）', () => {
    for (const [key, label] of Object.entries(ERA_LABEL)) {
      expect(LABEL_TO_ERA[label]).toBe(key)
    }
  })
})
