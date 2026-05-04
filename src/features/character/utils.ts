import type { CharacterDraft } from './types'

export const GENDER_OPTIONS = ['男性', '女性', 'その他'] as const

export function emptyCharacter(): CharacterDraft {
  return {
    name: '',
    role: '',
    archetypeRole: '',
    gender: '',
    age: '',
    skills: '',
    overview: '',
    appearance: '',
    personality: '',
    motivation: '',
    background: '',
  }
}

export function parseSkills(raw: string): string[] {
  return raw
    ? raw
        .split(/[、,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}
