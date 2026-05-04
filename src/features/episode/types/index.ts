export type EpisodeType = '独立' | '続編' | null

export type EpisodeStatus = '未公開' | '公開中'
export type EpisodeRelation = '続編' | '並列' | '単独'
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

export type FilterTab = 'all' | '続編' | '単独' | '未公開' | '公開中'

export interface FilterTabItem {
  key: FilterTab
  label: string
  icon?: string
}
