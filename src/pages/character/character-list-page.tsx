import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PlusIcon, TrashIcon } from '../../components/Icons'
import { ConfirmDialog, DashedAddButton, SpinnerDots } from '../../components/ui'
import type { ArchetypeRole, Character } from '../../features/character'
import {
  DesignSection,
  EditableSelect,
  EditableSkills,
  EditableText,
  ProtagonistCard,
  SubCharacterCard,
  useCharacterList,
} from '../../features/character'

type Tab = 'three-view' | 'basic-info'

export default function CharacterListPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)

  const {
    protagonist,
    subCharacters,
    listLoading,
    selectedId,
    setSelectedId,
    detail,
    detailLoading,
    isGenerating,
    deletingCharacter,
    setDeletingCharacter,
    handleFieldSave,
    handleGenerateThreeView,
    handleDelete,
  } = useCharacterList(storyId)

  const [activeTab, setActiveTab] = useState<Tab>('three-view')

  function openDelete(e: React.MouseEvent, character: Character) {
    e.stopPropagation()
    setDeletingCharacter(character)
  }

  if (listLoading) return (
    <div className="flex-1 flex justify-center pt-32">
      <SpinnerDots size="md" />
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: character list */}
      <div className="w-[40%] shrink-0 border-r border-[var(--border)] bg-[var(--bg)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
          <span className="text-[13px] font-semibold text-[var(--text-h)]">登場人物</span>
          <button
            type="button"
            onClick={() => navigate(`/stories/${id}/characters/new`)}
            className="flex items-center gap-1 text-[12px] text-[var(--accent)] hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
          >
            <PlusIcon size={11} />
            追加
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
          {protagonist && (
            <section>
              <p className="text-[11px] font-bold text-[var(--text)] mb-2 px-0.5">主人公</p>
              <div className="group flex items-center gap-1">
                <div
                  onClick={() => setSelectedId(protagonist.id)}
                  className={`flex-1 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${selectedId === protagonist.id ? 'border-[var(--accent)]' : 'border-transparent'}`}
                >
                  <ProtagonistCard character={protagonist} />
                </div>
                <button
                  type="button"
                  onClick={(e) => openDelete(e, protagonist)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none shrink-0"
                >
                  <TrashIcon size={12} />
                </button>
              </div>
            </section>
          )}

          <section>
            <p className="text-[11px] font-bold text-[var(--text)] mb-2 px-0.5">サブキャラクター</p>
            <div className="flex flex-col gap-2">
              {subCharacters.map((c) => (
                <div key={c.id} className="group flex items-center gap-1">
                  <div
                    onClick={() => setSelectedId(c.id)}
                    className={`flex-1 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${selectedId === c.id ? 'border-[var(--accent)]' : 'border-transparent'}`}
                  >
                    <SubCharacterCard character={c} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => openDelete(e, c)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none shrink-0"
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
              ))}
              <DashedAddButton label="新しいキャラクター" onClick={() => navigate(`/stories/${id}/characters/new`)} />
            </div>
          </section>
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f7f6f3]">
        {selectedId == null ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] text-[var(--text)]">キャラクターを選択してください</p>
          </div>
        ) : detailLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <SpinnerDots size="md" />
          </div>
        ) : detail && (
          <>
            <div className="shrink-0 bg-[var(--bg)] border-b border-[var(--border)] flex items-center px-6">
              {([['three-view', '３面図'], ['basic-info', '基本情報']] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[13px] border-b-2 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'three-view' ? (
                <div className="p-6 max-w-4xl w-full">
                  <DesignSection
                    character={detail}
                    isGenerating={isGenerating}
                    onGenerate={handleGenerateThreeView}
                  />
                </div>
              ) : (
                <div className="p-5 max-w-3xl w-full flex flex-col gap-6">
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-3.5 bg-purple-500 rounded-full shrink-0" />
                      <p className="text-[12px] font-semibold text-[var(--text-h)] m-0">基本情報</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <EditableText
                        label="名前" value={detail.name} required
                        placeholder="例: 佐藤 太郎"
                        onSave={(v) => handleFieldSave({ name: v || undefined })}
                      />
                      <EditableText
                        label="役割" value={detail.role}
                        placeholder="例: 主人公の友人"
                        onSave={(v) => handleFieldSave({ role: v || undefined })}
                      />
                      <EditableSelect
                        label="配役" value={detail.archetypeRole}
                        onSave={(v) => handleFieldSave({ archetypeRole: (v as ArchetypeRole) || undefined })}
                      />
                      <EditableText
                        label="年齢" value={detail.age}
                        placeholder="例: 17歳"
                        onSave={(v) => handleFieldSave({ age: v || undefined })}
                      />
                      <EditableText
                        label="性別" value={detail.gender}
                        placeholder="例: 男性"
                        onSave={(v) => handleFieldSave({ gender: v || undefined })}
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-3.5 bg-purple-500 rounded-full shrink-0" />
                      <p className="text-[12px] font-semibold text-[var(--text-h)] m-0">詳細設定</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <EditableText
                        label="概要・特徴" value={detail.overview} multiline
                        placeholder="キャラクターの全体的な説明..."
                        onSave={(v) => handleFieldSave({ overview: v || undefined })}
                      />
                      <EditableText
                        label="デフォルトの見た目（衣装など）" value={detail.appearance} multiline
                        placeholder="例: 白いワンピース、長い黒髪、青い瞳..."
                        onSave={(v) => handleFieldSave({ appearance: v || undefined })}
                      />
                      <EditableText
                        label="性格" value={detail.personality} multiline
                        placeholder="性格や行動原理..."
                        onSave={(v) => handleFieldSave({ personality: v || undefined })}
                      />
                      <EditableText
                        label="動機・目標" value={detail.motivation} multiline
                        placeholder="物語における目的..."
                        onSave={(v) => handleFieldSave({ motivation: v || undefined })}
                      />
                      <EditableText
                        label="背景・生い立ち" value={detail.background} multiline
                        placeholder="過去の経歴など..."
                        onSave={(v) => handleFieldSave({ background: v || undefined })}
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-3.5 bg-purple-500 rounded-full shrink-0" />
                      <p className="text-[12px] font-semibold text-[var(--text-h)] m-0">スキル・能力</p>
                    </div>
                    <EditableSkills
                      skills={detail.skills}
                      onSave={(s) => handleFieldSave({ skills: s })}
                    />
                  </section>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deletingCharacter}
        title="キャラクターを削除"
        message={deletingCharacter ? `「${deletingCharacter.name}」を削除しますか？この操作は取り消せません。` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCharacter(null)}
      />
    </div>
  )
}
