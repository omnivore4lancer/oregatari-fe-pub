import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, inputClass, SectionCard, SpinnerDots, textareaClass } from '../../components/ui'
import {
  ArchetypeRoleInfoModal,
  CharacterDetailModal,
  ARCHETYPE_ROLE_SPLIT,
} from '../../features/character'
import type { ArchetypeRole } from '../../features/character'
import {
  EditingActions,
  RelationshipGraph,
  StorySectionBlock,
  useStoryEdit,
  type SectionKey,
} from '../../features/story'

export default function StoryEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)

  const [editingSection, setEditingSection] = useState<SectionKey | null>(null)
  const [activeStoryTab, setActiveStoryTab] = useState(0)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const [selectedArchetypeRole, setSelectedArchetypeRole] = useState<ArchetypeRole | null>(null)

  const {
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
  } = useStoryEdit(storyId)

  function handleStartEdit(section: SectionKey) {
    startEdit(section)
    setEditingSection(section)
  }

  return (
    <div className="flex gap-4 p-5 items-start">
      <div className="flex-1 flex flex-col gap-3.5 min-w-0">
        <SectionCard
          title="時代背景"
          headerActions={
            <EditingActions
              editing={editingSection === 'era'}
              onEdit={() => handleStartEdit('era')}
              onDone={() => commitEdit('era', setEditingSection)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          {editingSection === 'era' ? (
            <textarea
              className={`${textareaClass} min-h-[120px]`}
              value={eraDraft}
              onChange={(e) => setEraDraft(e.target.value)}
            />
          ) : (
            <p className="text-[13px] text-[var(--text)] leading-relaxed">
              {eraBg || '（未設定）'}
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="歴史ストーリー"
          headerActions={
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={generating || editingSection !== null}
              >
                {generating ? <SpinnerDots /> : 'AI 生成'}
              </Button>
              <EditingActions
                editing={editingSection === 'story'}
                onEdit={() => handleStartEdit('story')}
                onDone={() => commitEdit('story', setEditingSection)}
                onCancel={() => setEditingSection(null)}
              />
            </div>
          }
        >
          <>
            <div className="flex border-b border-[var(--border)] mb-4">
              {(['導入', '展開', 'クライマックス', '結末'] as const).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveStoryTab(i)}
                  className={`px-4 py-2.5 text-[12px] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                    activeStoryTab === i
                      ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                      : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {editingSection === 'story' ? (
              <textarea
                className={`${textareaClass} min-h-[100px]`}
                value={storyDraft[(['intro', 'dev', 'climax', 'conclusion'] as const)[activeStoryTab]]}
                onChange={(e) => {
                  const key = (['intro', 'dev', 'climax', 'conclusion'] as const)[activeStoryTab]
                  setStoryDraft((prev) => ({ ...prev, [key]: e.target.value }))
                }}
              />
            ) : (
              <StorySectionBlock
                tag={['導入', '展開', 'クライマックス', '結末'][activeStoryTab]}
                content={[story.intro, story.dev, story.climax, story.conclusion][activeStoryTab] || '（未設定）'}
              />
            )}
          </>
        </SectionCard>

        <SectionCard
          title="主な登場人物"
          headerActions={
            <EditingActions
              editing={editingSection === 'characters'}
              onEdit={() => handleStartEdit('characters')}
              onDone={() => commitEdit('characters', setEditingSection)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          {editingSection === 'characters' ? (
            <div className="flex flex-col gap-3">
              {charactersDraft.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <input
                      className="w-full text-center bg-transparent text-purple-700 font-bold text-[13px] outline-none"
                      value={c.initials}
                      maxLength={2}
                      onChange={(e) => updateCharacterDraft(c.id, 'initials', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      className={`${inputClass} flex-1`}
                      placeholder="名前"
                      value={c.name}
                      onChange={(e) => updateCharacterDraft(c.id, 'name', e.target.value)}
                    />
                    <input
                      className={`${inputClass} flex-1`}
                      placeholder="役割"
                      value={c.role}
                      onChange={(e) => updateCharacterDraft(c.id, 'role', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 pt-1">
              {characters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCharacterId(c.id)}
                  className="flex flex-col items-center gap-1.5 w-20 h-32 bg-transparent border-none cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-base shrink-0 group-hover:ring-2 group-hover:ring-[var(--accent-border)] transition-all">
                    {c.initials}
                  </div>
                  <div className="flex flex-col items-center text-center flex-1">
                    <p className="text-[12px] font-semibold text-[var(--text-h)] leading-tight m-0">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-[var(--text)] leading-tight mt-0.5 m-0">
                      {c.role}
                    </p>
                    {c.archetypeRole && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedArchetypeRole(c.archetypeRole as ArchetypeRole)
                        }}
                        className="mt-1 flex flex-col items-center bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        <span className="text-[10px] font-semibold text-[var(--accent)] leading-tight">
                          {ARCHETYPE_ROLE_SPLIT[c.archetypeRole as ArchetypeRole].main}
                        </span>
                        <span className="text-[9px] text-[var(--text)] leading-tight">
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
                className="flex flex-col items-center gap-1.5 w-20 h-32 bg-transparent border-none cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text)] text-lg hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors">
                  +
                </div>
                <p className="text-[11px] text-[var(--text)] text-center m-0">追加する</p>
              </button>
            </div>
          )}
        </SectionCard>

        <RelationshipGraph
          storyId={storyId}
          characters={characters}
          relationships={relationships}
          onRelationshipsChange={setRelationships}
        />
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

      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg)] rounded-xl shadow-2xl w-[640px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--text-h)] font-semibold text-[14px]">
                <SpinnerDots />
                ストーリー生成中...
              </div>
            </div>
            <div
              ref={streamRef}
              className="flex-1 overflow-y-auto p-5 text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap"
            >
              {streamText}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
