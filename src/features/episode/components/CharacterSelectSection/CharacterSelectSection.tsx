import { useState } from 'react'

import { CharacterAvatar } from '../../../../components/ui'
import type { CharacterDetail } from '../../../character/types'

function getRoleBadge(character: CharacterDetail): { label: string; className: string } | null {
  if (character.isProtagonist) return { label: 'メイン', className: 'bg-amber-100 text-amber-700' }
  if (character.role.startsWith('ヒロイン'))
    return { label: 'ヒロイン', className: 'bg-purple-100 text-purple-700' }
  return null
}

interface CharacterRowProps {
  character: CharacterDetail
  checked: boolean
  onChange: (checked: boolean) => void
}

function CharacterRow({ character, checked, onChange }: CharacterRowProps) {
  const [importance, setImportance] = useState(50)
  const badge = getRoleBadge(character)
  const roleLabel = character.role

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden transition-all">
      <label className="flex items-start gap-3 py-3 px-4 cursor-pointer hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 shrink-0 accent-[var(--accent)] w-4 h-4"
        />
        <CharacterAvatar initials={character.initials} color={character.avatarColor} imageUrl={character.imageUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-[13px] text-[var(--text-h)]">{character.name}</span>
            {badge && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--text)]">{roleLabel}</div>
        </div>
      </label>

      {checked && (
        <div className="border-t border-[var(--border)] px-4 py-3 bg-gray-50 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {character.personality && (
              <DetailItem label="性格" value={character.personality} />
            )}
            {character.background && (
              <DetailItem label="背景" value={character.background} />
            )}
            {character.motivation && (
              <DetailItem label="動機" value={character.motivation} />
            )}
            {character.overview && (
              <DetailItem label="説明" value={character.overview} />
            )}
          </div>
          {character.skills.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-h)] mb-1.5">スキル</p>
              <div className="flex flex-wrap gap-1.5">
                {character.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] text-[var(--text-h)] border border-[var(--border)] bg-white px-2.5 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-semibold text-[var(--text-h)] m-0">このエピソードでの重要度</p>
              <span className="text-[11px] font-semibold text-[var(--accent)]">{importance}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full accent-[var(--accent)] h-1.5"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-[var(--border)] px-3 py-2">
      <p className="text-[11px] font-semibold text-[var(--text-h)] mb-0.5">{label}</p>
      <p className="text-[11px] text-[var(--text)] leading-relaxed m-0">{value}</p>
    </div>
  )
}

interface Props {
  characters: CharacterDetail[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function CharacterSelectSection({ characters, selectedIds, onChange }: Props) {
  function handleChange(id: number, checked: boolean) {
    onChange(checked ? [...selectedIds, id] : selectedIds.filter((c) => c !== id))
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[var(--text)]"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 className="text-[15px] font-semibold text-[var(--text-h)] m-0">登場キャラクター</h2>
        {selectedIds.length > 0 && (
          <span className="text-[11px] text-[var(--text)] bg-gray-100 px-2 py-0.5 rounded-full">
            {selectedIds.length}人選択中
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {[...characters].sort((a, b) => {
            if (a.isProtagonist !== b.isProtagonist) return a.isProtagonist ? -1 : 1
            return a.id - b.id
          }).map((character) => (
          <CharacterRow
            key={character.id}
            character={character}
            checked={selectedIds.includes(character.id)}
            onChange={(checked) => handleChange(character.id, checked)}
          />
        ))}
      </div>
    </section>
  )
}
