import { apiClient } from '../../../lib/apiClient'

export interface MaterialResponse {
  id: number
  storyId: number
  groupId: number
  name: string
  description: string | null
  aspectRatio: string
  artStyle: string
  locationMain: string
  locationDetail: string | null
  worldSetting: string | null
  timeSlot: string
  weather: string
  skyDesc: string | null
  lighting: string | null
  fgLStructure: string | null
  fgLTexture: string | null
  fgLFurniture: string | null
  fgLProps: string | null
  mgCGround: string | null
  mgCDecoration: string | null
  mgCAtmosphere: string | null
  mgRStructure: string | null
  mgRItems: string | null
  bgBuilding: string | null
  bgTerrain: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateMaterialInput {
  groupId: number
  name: string
  description?: string
  aspectRatio: string
  artStyle: string
  locationMain: string
  locationDetail?: string
  worldSetting?: string
  timeSlot: string
  weather: string
  skyDesc?: string
  lighting?: string
  fgLStructure?: string
  fgLTexture?: string
  fgLFurniture?: string
  fgLProps?: string
  mgCGround?: string
  mgCDecoration?: string
  mgCAtmosphere?: string
  mgRStructure?: string
  mgRItems?: string
  bgBuilding?: string
  bgTerrain?: string
}

export const materialApi = {
  getMaterials: (
    storyId: number,
    options?: { groupId?: number; search?: string; sort?: 'asc' | 'desc' },
  ) => {
    const params = new URLSearchParams()
    if (options?.groupId != null) params.set('groupId', String(options.groupId))
    if (options?.search) params.set('search', options.search)
    if (options?.sort) params.set('sort', options.sort)
    const qs = params.toString()
    return apiClient.get<MaterialResponse[]>(`/stories/${storyId}/materials${qs ? `?${qs}` : ''}`)
  },
  getMaterial: (storyId: number, materialId: number) =>
    apiClient.get<MaterialResponse>(`/stories/${storyId}/materials/${materialId}`),
  createMaterial: (storyId: number, data: CreateMaterialInput) =>
    apiClient.post<MaterialResponse>(`/stories/${storyId}/materials`, data),
  updateMaterial: (storyId: number, materialId: number, data: Partial<CreateMaterialInput>) =>
    apiClient.put<MaterialResponse>(`/stories/${storyId}/materials/${materialId}`, data),
  deleteMaterial: (storyId: number, materialId: number) =>
    apiClient.delete<{ message: string }>(`/stories/${storyId}/materials/${materialId}`),
}
