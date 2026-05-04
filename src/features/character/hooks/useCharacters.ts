import { useEffect, useState } from 'react'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { characterApi, toCharacterDetail } from '../api/characterApi'
import type { CharacterDetail } from '../types'

export function useCharacters(storyId: number): CharacterDetail[] {
  const [characters, setCharacters] = useState<CharacterDetail[]>([])
  const { showError } = useApiError()

  useEffect(() => {
    characterApi
      .getCharacters(storyId)
      .then((list) => setCharacters(list.map(toCharacterDetail)))
      .catch(showError)
  }, [storyId, showError])

  return characters
}
