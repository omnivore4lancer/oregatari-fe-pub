import { apiClient } from '../../../lib/apiClient'

export interface MaterialGroupResponse {
  id: number
  storyId: number
  name: string
}

export const materialGroupApi = {
  getGroups: (storyId: number) =>
    apiClient.get<MaterialGroupResponse[]>(`/stories/${storyId}/material-groups`),
  createGroup: (storyId: number, data: { name: string }) =>
    apiClient.post<MaterialGroupResponse>(`/stories/${storyId}/material-groups`, data),
  deleteGroup: (storyId: number, groupId: number) =>
    apiClient.delete<{ message: string }>(`/stories/${storyId}/material-groups/${groupId}`),
}
