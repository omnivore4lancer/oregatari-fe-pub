import { useEffect, useRef, useState } from 'react'

import { useApiError } from '../../../contexts/ApiErrorContext'
import { useToast } from '../../../contexts/ToastContext'
import { characterApi } from '../../character'
import type { CharacterResponse } from '../../character'
import { relationshipApi, storyApi } from '../index'
import type { CharacterItem, CharacterRelationshipResponse, SectionKey } from '../index'

interface StorySections {
  intro: string
  dev: string
  climax: string
  conclusion: string
}

export function useStoryEdit(storyId: number) {
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [eraBg, setEraBg] = useState('')
  const [eraDraft, setEraDraft] = useState('')

  const [story, setStory] = useState<StorySections>({
    intro: '',
    dev: '',
    climax: '',
    conclusion: '',
  })
  const [storyDraft, setStoryDraft] = useState<StorySections>({
    intro: '',
    dev: '',
    climax: '',
    conclusion: '',
  })

  const [generating, setGenerating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const streamRef = useRef<HTMLDivElement>(null)

  const [characters, setCharacters] = useState<CharacterItem[]>([])
  const [charactersDraft, setCharactersDraft] = useState<CharacterItem[]>([])
  const [relationships, setRelationships] = useState<CharacterRelationshipResponse[]>([])

  useEffect(() => {
    storyApi
      .getStory(storyId)
      .then((s) => {
        const bg = s.eraBg ?? ''
        setEraBg(bg)
        setEraDraft(bg)
        const sections = {
          intro: s.intro ?? '',
          dev: s.dev ?? '',
          climax: s.climax ?? '',
          conclusion: s.conclusion ?? '',
        }
        setStory(sections)
        setStoryDraft(sections)
      })
      .catch(showError)
    characterApi
      .getCharacters(storyId)
      .then((list: CharacterResponse[]) => {
        const mapped = list.map((c) => ({
          id: c.id,
          initials: c.name.charAt(0),
          name: c.name,
          role: c.role ?? '',
          isProtagonist: c.isProtagonist,
          archetypeRole: c.archetypeRole,
        }))
        setCharacters(mapped)
        setCharactersDraft(mapped)
      })
      .catch(showError)
    relationshipApi
      .getRelationships(storyId)
      .then(setRelationships)
      .catch(showError)
  }, [storyId, showError])

  function startEdit(section: SectionKey) {
    if (section === 'era') setEraDraft(eraBg)
    if (section === 'story') setStoryDraft(story)
    if (section === 'characters') setCharactersDraft(characters)
  }

  async function commitEdit(section: SectionKey, setEditingSection: (s: SectionKey | null) => void) {
    try {
      if (section === 'era') {
        setEraBg(eraDraft)
        await storyApi.updateStory(storyId, { eraBg: eraDraft })
      }
      if (section === 'story') {
        setStory(storyDraft)
        await storyApi.updateStory(storyId, storyDraft)
      }
      if (section === 'characters') {
        setCharacters(charactersDraft)
      }
      showToast('保存しました')
    } catch (e) {
      showError(e)
    }
    setEditingSection(null)
  }

  function updateCharacterDraft(id: number, field: 'name' | 'role' | 'initials', value: string) {
    setCharactersDraft((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  async function handleGenerate() {
    setGenerating(true)
    setStreamText('')
    try {
      await storyApi.generateStory(storyId, (text) => {
        setStreamText((prev) => {
          const next = prev + text
          setTimeout(() => {
            if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight
          }, 0)
          return next
        })
      })
      const s = await storyApi.getStory(storyId)
      setEraBg(s.eraBg ?? '')
      setEraDraft(s.eraBg ?? '')
      setStory({
        intro: s.intro ?? '',
        dev: s.dev ?? '',
        climax: s.climax ?? '',
        conclusion: s.conclusion ?? '',
      })
      setStoryDraft({
        intro: s.intro ?? '',
        dev: s.dev ?? '',
        climax: s.climax ?? '',
        conclusion: s.conclusion ?? '',
      })
      showToast('ストーリーを生成しました')
    } catch (e) {
      showError(e)
    } finally {
      setGenerating(false)
    }
  }

  return {
    eraBg,
    eraDraft,
    setEraDraft,
    story,
    storyDraft,
    setStoryDraft,
    characters,
    charactersDraft,
    relationships,
    setRelationships,
    generating,
    streamText,
    streamRef,
    startEdit,
    commitEdit,
    updateCharacterDraft,
    handleGenerate,
  }
}
