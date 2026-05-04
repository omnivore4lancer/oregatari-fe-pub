export interface PanelCharacterLine {
  text: string
  char_text_position?: string
  type?: string
  balloon_shape?: string
}

export interface PanelCharacter {
  name: string
  panel_position?: string
  shot?: string
  emotion?: string
  facing?: string
  pose?: string
  camera_proximity?: string
  lines?: PanelCharacterLine[]
}

export interface EpisodePanelData {
  id: number
  panelOrder: number
  pagePosition: string | null
  description: string | null
  cameraAngle: string | null
  perspectiveIntensity: string | null
  depthLayers: Record<string, string>
  background: string | null
  characters: PanelCharacter[]
  effects: string[]
  lensAndLighting: string | null
  frame: string
  scale: number
  imagePrompt: string | null
  imageUrl: string | null
}

export interface EpisodePageRowData {
  id: number
  rowNumber: number
  heightRatio: string
  layoutType: string
  panels: EpisodePanelData[]
}

export interface EpisodePageData {
  id: number
  pageNumber: number
  instructions: string | null
  imageUrl: string | null
  rows: EpisodePageRowData[]
}
