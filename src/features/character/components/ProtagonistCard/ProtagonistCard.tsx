import { CharacterAvatar } from '../../../../components/ui'
import type { Character } from '../../types'

interface ProtagonistCardProps {
  character: Character
  onClick?: () => void
}

export function ProtagonistCard({ character, onClick }: ProtagonistCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 flex gap-4 cursor-pointer hover:border-[var(--accent-border)] transition-colors"
    >
      <CharacterAvatar initials={character.initials} color={character.avatarColor} imageUrl={character.faceImageUrl ?? character.imageUrl} size="lg" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-[15px] text-[var(--text-h)]">{character.name}</span>
          <span className="text-[11px] text-[var(--accent)] bg-[var(--accent-bg)] px-1.5 py-0.5 rounded font-medium">
            {character.role}
          </span>
        </div>
        <p className="text-[13px] text-[var(--text)] leading-relaxed line-clamp-3">
          {character.description}
        </p>
      </div>
    </div>
  )
}
