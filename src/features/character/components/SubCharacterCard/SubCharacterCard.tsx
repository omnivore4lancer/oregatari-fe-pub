import { CharacterAvatar } from '../../../../components/ui'
import type { Character } from '../../types'

interface SubCharacterCardProps {
  character: Character
  onClick?: () => void
}

export function SubCharacterCard({ character, onClick }: SubCharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3.5 flex gap-3 cursor-pointer hover:border-[var(--accent-border)] transition-colors"
    >
      <CharacterAvatar initials={character.initials} color={character.avatarColor} imageUrl={character.faceImageUrl ?? character.imageUrl} size="md" />
      <div className="min-w-0">
        <p className="font-bold text-[13px] text-[var(--text-h)] leading-tight mb-0.5">
          {character.name}
        </p>
        <p className="text-[11px] text-[var(--text)] mb-1.5">{character.role}</p>
        <p className="text-[12px] text-[var(--text)] leading-relaxed line-clamp-3">
          {character.description}
        </p>
      </div>
    </div>
  )
}
