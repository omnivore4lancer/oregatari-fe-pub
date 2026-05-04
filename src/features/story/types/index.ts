export type SectionKey = 'era' | 'story' | 'characters'

export interface CharacterItem {
  id: number
  initials: string
  name: string
  role: string
  isProtagonist: boolean
  archetypeRole: string | null
}
