export interface NewsItem {
  id: number
  tag: string
  date: string
  title: string
}

export interface StoryItem {
  id: number
  title: string
  badge: string
  age: string
  coverImageUrl: string | null
  previewImages: string[]
}
