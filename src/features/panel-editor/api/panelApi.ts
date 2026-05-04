import { apiClient } from '../../../lib/apiClient'
import type { Panel } from '../types'

interface PanelResponse {
  id: string
  storyId: number
  vertices: [number, number][]
  prompt: string
  imageUrl: string | null
}

export const panelApi = {
  getPanels: (storyId: number) => apiClient.get<PanelResponse[]>(`/stories/${storyId}/panels`),
  savePanels: (storyId: number, panels: Panel[]) =>
    apiClient.put<PanelResponse[]>(`/stories/${storyId}/panels`, panels),
}
