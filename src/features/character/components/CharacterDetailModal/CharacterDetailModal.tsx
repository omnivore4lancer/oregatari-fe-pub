import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EditIcon } from '../../../../components/Icons'
import { Button, CharacterAvatar } from '../../../../components/ui'
import { useApiError } from '../../../../contexts/ApiErrorContext'
import { characterApi, toCharacterDetail } from '../../api/characterApi'
import type { CharacterDetail } from '../../types'

interface Props {
  storyId: number
  characterId: number | null
  onClose: () => void
}

const INFO_ITEMS: { label: string; key: keyof CharacterDetail }[] = [
  { label: '概要', key: 'overview' },
  { label: '性格', key: 'personality' },
  { label: '背景', key: 'background' },
  { label: '動機', key: 'motivation' },
]

export function CharacterDetailModal({ storyId, characterId, onClose }: Props) {
  const navigate = useNavigate()
  const { showError } = useApiError()
  const [character, setCharacter] = useState<CharacterDetail | null>(null)

  useEffect(() => {
    if (characterId == null) {
      setCharacter(null)
      return
    }
    characterApi
      .getCharacter(storyId, characterId)
      .then((r) => setCharacter(toCharacterDetail(r)))
      .catch(showError)
  }, [storyId, characterId, showError])

  if (characterId == null) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {character == null ? (
          <div className="flex items-center justify-center h-48 text-[13px] text-[var(--text)]">
            読み込み中...
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <CharacterAvatar
                initials={character.initials}
                color={character.avatarColor}
                imageUrl={character.imageUrl}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[15px] text-[var(--text-h)]">
                    {character.name}
                  </span>
                  {character.role && (
                    <span className="text-[10px] text-[var(--text)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                      {character.role}
                    </span>
                  )}
                </div>
                {(character.age || character.gender) && (
                  <p className="text-[12px] text-[var(--text)] mt-0.5 m-0">
                    {[character.age, character.gender].filter(Boolean).join(' / ')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors cursor-pointer bg-transparent border-none p-1 text-lg shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {INFO_ITEMS.map(({ label, key }) => {
                  const value = character[key] as string
                  if (!value) return null
                  return (
                    <div key={label}>
                      <p className="text-[11px] font-bold text-[var(--text-h)] mb-1">{label}</p>
                      <p className="text-[12px] text-[var(--text)] leading-relaxed m-0">{value}</p>
                    </div>
                  )
                })}
              </div>

              {character.skills.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-[var(--text-h)] mb-2">スキル・能力</p>
                  <div className="flex flex-wrap gap-1.5">
                    {character.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] text-[var(--text-h)] border border-[var(--border)] px-2.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[var(--border)] flex justify-end">
              <Button
                className="flex items-center gap-1.5 text-[12px]"
                onClick={() => navigate(`/stories/${storyId}/characters/${characterId}/edit`)}
              >
                <EditIcon size={11} />
                プロフィール編集
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
