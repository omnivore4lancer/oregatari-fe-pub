import { Button, CharacterAvatar, SectionCard } from '../../../../components/ui'
import type { Character } from '../../../character/types'
import { ELEMENT_TAGS, LAYOUTS, VISUAL_STYLES } from '../../const/publish.constants'
import { StepBadge } from '../StepBadge/StepBadge'

interface Props {
  characters: Character[]
  selectedCharIds: number[]
  onToggleChar: (id: number) => void
  selectedStyle: string | null
  onStyleChange: (style: string | null) => void
  selectedLayout: string | null
  onLayoutChange: (layout: string | null) => void
  description: string
  onDescriptionChange: (desc: string) => void
  activeTab: number
  onTabChange: (tab: number) => void
  completedSteps: number
  isGeneratingCover: boolean
  onGenerateCoverImage: () => void
  onSave: () => void
}

const TABS = [
  { n: '①', label: '登場キャラクター' },
  { n: '②', label: 'ビジュアルスタイル' },
  { n: '③', label: '構図・レイアウト' },
  { n: '④', label: '描写 & 生成' },
] as const

export function PublishCoverSettings({
  characters,
  selectedCharIds,
  onToggleChar,
  selectedStyle,
  onStyleChange,
  selectedLayout,
  onLayoutChange,
  description,
  onDescriptionChange,
  activeTab,
  onTabChange,
  completedSteps,
  isGeneratingCover,
  onGenerateCoverImage,
  onSave,
}: Props) {
  return (
    <SectionCard
      title="公開時のカバー画像"
      headerActions={
        <>
          <span className="text-[12px] text-[var(--text)]">{completedSteps}/4 完了中</span>
          <Button
            variant="primary"
            className="text-[12px]"
            onClick={onGenerateCoverImage}
            disabled={isGeneratingCover || selectedCharIds.length === 0}
          >
            {isGeneratingCover ? '生成中...' : '🎨 生成'}
          </Button>
          <Button
            onClick={onSave}
            className="text-[12px] border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600"
          >
            保存
          </Button>
        </>
      }
    >
      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] mb-4">
        {TABS.map((tab, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onTabChange(i)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === i
                ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
            }`}
          >
            <StepBadge n={tab.n} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-w-0">
        {/* ① Characters */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-1.5">
            {characters.map((c) => {
              const active = selectedCharIds.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onToggleChar(c.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg border text-left cursor-pointer transition-colors ${
                    active
                      ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]'
                      : 'border-[var(--border)] bg-transparent hover:border-[var(--accent-border)]'
                  }`}
                >
                  <CharacterAvatar
                    initials={c.initials}
                    color={c.avatarColor}
                    imageUrl={c.imageUrl}
                    size="sm"
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="text-[12px] font-bold text-[var(--text-h)]">{c.name}</span>
                      {c.role && (
                        <span className="text-[10px] text-[var(--text)] bg-gray-100 px-1.5 py-0.5 rounded">
                          {c.role}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text)] leading-relaxed line-clamp-1 m-0">
                      {c.description}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center transition-colors ${
                      active ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)]'
                    }`}
                  >
                    {active && <span className="text-white text-[8px] leading-none">✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ② Visual Style */}
        {activeTab === 1 && (
          <div className="grid grid-cols-3 gap-1.5">
            {VISUAL_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onStyleChange(s.id === selectedStyle ? null : s.id)}
                className={`flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-lg border text-[10px] cursor-pointer transition-colors ${
                  selectedStyle === s.id
                    ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] font-semibold'
                    : 'border-[var(--border)] bg-transparent text-[var(--text-h)] hover:border-[var(--accent-border)]'
                }`}
              >
                <span className="text-base leading-none">{s.emoji}</span>
                <span className="truncate w-full text-center">{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ③ Layout */}
        {activeTab === 2 && (
          selectedCharIds.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center px-3 py-8">
              <p className="text-[12px] text-[var(--text)] text-center m-0">
                先にキャラクターを選択してください
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {LAYOUTS.map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => onLayoutChange(layout === selectedLayout ? null : layout)}
                  className={`py-2 px-2 rounded-lg border text-[11px] cursor-pointer transition-colors ${
                    selectedLayout === layout
                      ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] font-semibold'
                      : 'border-[var(--border)] bg-transparent text-[var(--text-h)] hover:border-[var(--accent-border)]'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          )
        )}

        {/* ④ Description & Generate */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-[13px] text-[var(--text-h)] bg-transparent outline-none resize-none min-h-[72px] block font-[inherit]"
                placeholder="生成から必然とした要素..."
                value={description}
                maxLength={5000}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
              <span className="absolute right-2 bottom-2 text-[10px] text-[var(--text)]">
                {description.length}/5000文字
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ELEMENT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onDescriptionChange(description + (description ? ' ' : '') + tag)}
                  className="text-[10px] px-2 py-0.5 border border-[var(--border)] rounded-full text-[var(--text)] cursor-pointer bg-transparent hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              className="w-full py-3 text-[14px] justify-center"
              onClick={onGenerateCoverImage}
              disabled={isGeneratingCover || selectedCharIds.length === 0}
            >
              {isGeneratingCover ? '生成中...' : '🎨 カバー画像生成'}
            </Button>
            {selectedCharIds.length === 0 && (
              <div className="flex items-start gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-500 shrink-0">⚠</span>
                <p className="text-[11px] text-amber-700 m-0">
                  カバー画像を生成するには、登場キャラクターを1名以上選択してください。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
