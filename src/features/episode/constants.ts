import type { EpisodeRelation, EpisodeStatus, EpisodeType, FilterTabItem } from './types'

export const EPISODE_STATUS = {
  UNPUBLISHED: 'unpublished',
  PUBLISHED: 'published',
} as const satisfies Record<string, EpisodeStatus>

export const EPISODE_RELATION = {
  SEQUEL: 'sequel',
  PARALLEL: 'parallel',
  STANDALONE: 'standalone',
} as const satisfies Record<string, EpisodeRelation>

export const EPISODE_TYPE = {
  STANDALONE: 'standalone',
  SEQUEL: 'sequel',
} as const satisfies Record<string, EpisodeType>

export const filterTabs: FilterTabItem[] = [
  { key: 'sequel', label: '続編' },
  { key: 'standalone', label: '単独' },
  { key: 'unpublished', label: '未公開' },
  { key: 'published', label: '公開' },
]

export const EPISODE_STATUS_LABEL: Record<EpisodeStatus, string> = {
  unpublished: '未公開',
  published: '公開中',
}

export const EPISODE_RELATION_LABEL: Record<EpisodeRelation, string> = {
  sequel: '続編',
  parallel: '並列',
  standalone: '単独',
}

export const EPISODE_TYPE_LABEL: Record<NonNullable<EpisodeType>, string> = {
  standalone: '独立',
  sequel: '続編',
}
