import { queryKeys } from '../../../lib/queryKeys'
import { useQueryWithError } from '../../../lib/useQueryWithError'
import { characterApi, toCharacterDetail } from '../api/characterApi'
import type { CharacterDetail } from '../types'

export function useCharacters(storyId: number): CharacterDetail[] {
  const { data = [] } = useQueryWithError({
    queryKey: queryKeys.characters(storyId),
    queryFn: () => characterApi.getCharacters(storyId),
    select: (list) => list.map(toCharacterDetail),
  })
  return data
}
