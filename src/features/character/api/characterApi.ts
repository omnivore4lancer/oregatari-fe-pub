import { apiClient } from '../../../lib/apiClient'
import type { ArchetypeRole, Character, CharacterDetail } from '../types'

export interface CharacterResponse {
  id: number
  storyId: number
  isProtagonist: boolean
  name: string
  role: string | null
  archetypeRole: ArchetypeRole | null
  age: string | null
  gender: string | null
  overview: string | null
  appearance: string | null
  personality: string | null
  motivation: string | null
  background: string | null
  skills: string[]
  avatarColor: string | null
  imageUrl: string | null
  faceImageUrl: string | null
  createdAt: string
  updatedAt: string
}

const AVATAR_COLORS = [
  '#334155',
  '#fb7185',
  '#8b5cf6',
  '#f59e0b',
  '#14b8a6',
  '#0891b2',
  '#10b981',
  '#ec4899',
]

function colorForId(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

export function toCharacter(r: CharacterResponse): Character {
  return {
    id: r.id,
    initials: r.name.charAt(0),
    name: r.name,
    role: r.role ?? '',
    isProtagonist: r.isProtagonist,
    description: r.overview ?? '',
    avatarColor: r.avatarColor ?? colorForId(r.id),
    imageUrl: r.imageUrl ?? null,
    faceImageUrl: r.faceImageUrl ?? null,
    age: r.age ?? undefined,
    gender: r.gender ?? undefined,
  }
}

export function toCharacterDetail(r: CharacterResponse): CharacterDetail {
  return {
    ...toCharacter(r),
    age: r.age ?? '',
    gender: r.gender ?? '',
    archetypeRole: r.archetypeRole ?? null,
    overview: r.overview ?? '',
    appearance: r.appearance ?? '',
    personality: r.personality ?? '',
    background: r.background ?? '',
    motivation: r.motivation ?? '',
    skills: r.skills,
  }
}

export interface CreateCharacterInput {
  name: string
  isProtagonist?: boolean
  role?: string
  archetypeRole?: ArchetypeRole
  age?: string
  gender?: string
  overview?: string
  appearance?: string
  personality?: string
  motivation?: string
  background?: string
  skills?: string[]
  avatarColor?: string
}

export const characterApi = {
  getCharacters: (storyId: number) =>
    apiClient.get<CharacterResponse[]>(`/stories/${storyId}/characters`),
  getCharacter: (storyId: number, charId: number) =>
    apiClient.get<CharacterResponse>(`/stories/${storyId}/characters/${charId}`),
  createCharacter: (storyId: number, data: CreateCharacterInput) =>
    apiClient.post<CharacterResponse>(`/stories/${storyId}/characters`, data),
  updateCharacter: (storyId: number, charId: number, data: Partial<CreateCharacterInput>) =>
    apiClient.put<CharacterResponse>(`/stories/${storyId}/characters/${charId}`, data),
  deleteCharacter: (storyId: number, charId: number) =>
    apiClient.delete<{ message: string }>(`/stories/${storyId}/characters/${charId}`),
  generateThreeView: (storyId: number, charId: number) =>
    apiClient.post<{ jobId: string }>(`/stories/${storyId}/characters/${charId}/generate-three-view`, {}),
}
