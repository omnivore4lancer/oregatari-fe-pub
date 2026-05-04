import type { EpisodePageData } from '../episode'

export interface CoverPage {
  type: 'cover'
  episodeNumber: number
  episodeTitle: string
  coverImageUrl: string | null
}

export interface TitlePage {
  type: 'title'
  episodeNumber: number
  episodeTitle: string
}

export interface MangaPage {
  type: 'manga'
  data: EpisodePageData
}

export type ViewerPage = CoverPage | TitlePage | MangaPage
