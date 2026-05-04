export interface Panel {
  id: string
  vertices: [number, number][] // normalized 0-1 polygon vertices (in order)
  prompt: string
  imageUrl: string | null
}
