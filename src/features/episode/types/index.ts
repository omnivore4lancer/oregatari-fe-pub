export type EpisodeType = 'standalone' | 'sequel' | null

export type EpisodeStatus = 'unpublished' | 'published'
export type EpisodeRelation = 'sequel' | 'parallel' | 'standalone'
export type GeneratingState = 'generating' | 'done'

export interface Episode {
  id: number
  number: number
  title: string
  status: EpisodeStatus
  relation: EpisodeRelation
  description: string
  content: string
  createdAt: string
  generatingState: GeneratingState
  characterIds: number[]
  inheritRelation: boolean
  hasScenes: boolean
}

export type FilterTab = 'all' | 'sequel' | 'standalone' | 'unpublished' | 'published'

export interface FilterTabItem {
  key: FilterTab
  label: string
  icon?: string
}
