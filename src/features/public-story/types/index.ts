export interface PublicEpisode {
  id: number
  number: number
  title: string
  thumbnailUrl: string | null
  createdAt: string
}

export interface PublicStory {
  id: number
  name: string
  genres: { id: number; name: string }[]
  authorName: string | null
  description: string | null
  tags: string[]
  coverImageUrl: string | null
  publishedAt: string | null
  firstEpisodeCreatedAt: string | null
  latestEpisodeCreatedAt: string | null
  episodes: PublicEpisode[]
}
