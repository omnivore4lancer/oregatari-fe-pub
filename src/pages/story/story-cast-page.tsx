import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { inputClass, SectionCard, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import {
  ArchetypeRoleInfoModal,
  characterApi,
  CharacterDetailModal,
  ARCHETYPE_ROLE_SPLIT,
} from '../../features/character'
import type { ArchetypeRole, CharacterResponse } from '../../features/character'
import {
  relationshipApi,
  EditingActions,
  RelationshipGraph,
  type CharacterItem,
  type CharacterRelationshipResponse,
  type SectionKey,
} from '../../features/story'

function StoryEditTabs({ storyId }: { storyId: number }) {
  const { pathname } = useLocation()
  const base = `/stories/${storyId}`
  return (
    <div className="flex border-b border-[var(--border)] bg-[var(--bg)] px-5 gap-1">
      {[
        { label: 'ストーリー', path: `${base}/story` },
        { label: '相関図', path: `${base}/cast` },
      ].map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-4 py-2.5 text-[13px] font-medium no-underline border-b-2 transition-colors ${
            pathname === tab.path
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

export default function StoryCastPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [editingSection, setEditingSection] = useState<SectionKey | null>(null)
  const [characters, setCharacters] = useState<CharacterItem[]>([])
  const [charactersDraft, setCharactersDraft] = useState<CharacterItem[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const [highlightedCharacterId, setHighlightedCharacterId] = useState<number | null>(null)
  const [selectedArchetypeRole, setSelectedArchetypeRole] = useState<ArchetypeRole | null>(null)
  const [relationships, setRelationships] = useState<CharacterRelationshipResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      characterApi.getCharacters(storyId),
      relationshipApi.getRelationships(storyId),
    ])
      .then(([list, rels]: [CharacterResponse[], CharacterRelationshipResponse[]]) => {
        const mapped = list
          .map((c) => ({
            id: c.id,
            initials: c.name.charAt(0),
            name: c.name,
            role: c.role ?? '',
            isProtagonist: c.isProtagonist,
            archetypeRole: c.archetypeRole,
          }))
          .sort((a, b) => {
            if (a.isProtagonist !== b.isProtagonist) return a.isProtagonist ? -1 : 1
            return a.id - b.id
          })
        setCharacters(mapped)
        setCharactersDraft(mapped)
        setRelationships(rels)
      })
      .catch(showError)
      .finally(() => setLoading(false))
  }, [storyId, showError])

  function startEdit(section: SectionKey) {
    if (section === 'characters') setCharactersDraft(characters)
    setEditingSection(section)
  }

  async function commitEdit(section: SectionKey) {
    try {
      if (section === 'characters') setCharacters(charactersDraft)
      showToast('保存しました')
    } catch (e) {
      showError(e)
    }
    setEditingSection(null)
  }

  function updateCharacterDraft(id: number, field: 'name' | 'role' | 'initials', value: string) {
    setCharactersDraft((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  if (loading) return (
    <div className="flex-1 flex justify-center pt-32">
      <SpinnerDots size="md" />
    </div>
  )

  return (
    <>
      <StoryEditTabs storyId={storyId} />
      <div className="flex gap-4 p-5 items-start">
        {/* 左列: 登場人物リスト */}
        <div className="w-64 shrink-0">
          <SectionCard
            title="主な登場人物"
            headerActions={
              <EditingActions
                editing={editingSection === 'characters'}
                onEdit={() => startEdit('characters')}
                onDone={() => commitEdit('characters')}
                onCancel={() => setEditingSection(null)}
              />
            }
          >
            {editingSection === 'characters' ? (
              <div className="flex flex-col gap-2.5">
                {charactersDraft.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <input
                        className="w-full text-center bg-transparent text-purple-700 font-bold text-[12px] outline-none"
                        value={c.initials}
                        maxLength={2}
                        onChange={(e) => updateCharacterDraft(c.id, 'initials', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <input
                        className={`${inputClass} text-[12px] py-0.5`}
                        placeholder="名前"
                        value={c.name}
                        onChange={(e) => updateCharacterDraft(c.id, 'name', e.target.value)}
                      />
                      <input
                        className={`${inputClass} text-[11px] py-0.5`}
                        placeholder="役割"
                        value={c.role}
                        onChange={(e) => updateCharacterDraft(c.id, 'role', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {characters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCharacterId(c.id)}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg border-none cursor-pointer transition-colors text-left w-full group ${
                      highlightedCharacterId === c.id
                        ? 'bg-[var(--accent-bg)] ring-1 ring-[var(--accent-border)]'
                        : 'bg-transparent hover:bg-[var(--border)]/30'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 transition-all ${
                        highlightedCharacterId === c.id
                          ? 'bg-[var(--accent)] text-white ring-2 ring-[var(--accent-border)]'
                          : 'bg-purple-100 text-purple-700 group-hover:ring-2 group-hover:ring-[var(--accent-border)]'
                      }`}
                    >
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[var(--text-h)] leading-tight m-0 truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-[var(--text)] leading-tight mt-0.5 m-0 truncate">
                        {c.role}
                      </p>
                      {c.archetypeRole && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedArchetypeRole(c.archetypeRole as ArchetypeRole)
                          }}
                          className="mt-0.5 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity p-0 text-left"
                        >
                          <span className="text-[10px] font-semibold text-[var(--accent)] leading-tight">
                            {ARCHETYPE_ROLE_SPLIT[c.archetypeRole as ArchetypeRole].main}
                          </span>
                          <span className="text-[9px] text-[var(--text)] leading-tight ml-1">
                            {ARCHETYPE_ROLE_SPLIT[c.archetypeRole as ArchetypeRole].sub}
                          </span>
                        </button>
                      )}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate(`/stories/${id}/characters/new`)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-transparent border-none cursor-pointer hover:bg-[var(--border)]/30 transition-colors text-left w-full"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text)] text-base hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors shrink-0">
                    +
                  </div>
                  <p className="text-[11px] text-[var(--text)] m-0">追加する</p>
                </button>
              </div>
            )}
          </SectionCard>
        </div>

        {/* 右列: 相関図 */}
        <div className="flex-1 min-w-0">
          <RelationshipGraph
            storyId={storyId}
            characters={characters}
            relationships={relationships}
            onRelationshipsChange={setRelationships}
            selectedCharacterId={highlightedCharacterId}
            onCharacterSelect={setHighlightedCharacterId}
          />
        </div>
      </div>

      <ArchetypeRoleInfoModal
        archetypeRole={selectedArchetypeRole}
        onClose={() => setSelectedArchetypeRole(null)}
      />
      <CharacterDetailModal
        storyId={storyId}
        characterId={selectedCharacterId}
        onClose={() => setSelectedCharacterId(null)}
      />
    </>
  )
}
