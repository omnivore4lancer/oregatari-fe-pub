import { apiClient } from '../../../lib/apiClient'

export interface CharacterRelationshipResponse {
  id: number
  storyId: number
  fromCharacterId: number
  toCharacterId: number
  type: string
  description: string | null
}

export interface UpdateCharacterRelationshipInput {
  type?: string
  description?: string | null
}

export const relationshipApi = {
  getRelationships: (storyId: number) =>
    apiClient.get<CharacterRelationshipResponse[]>(
      `/stories/${storyId}/character-relationships`,
    ),
  updateRelationship: (storyId: number, id: number, data: UpdateCharacterRelationshipInput) =>
    apiClient.patch<CharacterRelationshipResponse>(
      `/stories/${storyId}/character-relationships/${id}`,
      data,
    ),
  deleteRelationship: (storyId: number, id: number) =>
    apiClient.delete<void>(`/stories/${storyId}/character-relationships/${id}`),
}
