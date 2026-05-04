import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  DashedAddButton,
  inputClass,
  OptionalBadge,
  RequiredBadge,
  textareaClass,
  ToggleButton,
} from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import {
  characterApi,
  CharacterDraftCard,
  emptyCharacter,
  parseSkills,
  ProtagonistFormSection,
} from '../../features/character'
import type { CharacterDraft } from '../../features/character'
import { genreApi, LABEL_TO_ERA, storyApi } from '../../features/story'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

const MAX_GENRES = 3
const ERA_OPTIONS = ['現代', '古代/中世', '未来/SF']

const STEPS = [
  { label: '基本情報' },
  { label: '世界観' },
  { label: '主人公' },
  { label: '登場人物' },
] as const

type StepIndex = 0 | 1 | 2 | 3

export default function StoryCreatePage() {
  const navigate = useNavigate()
  const { showError } = useApiError()
  const { showToast } = useToast()

  const [step, setStep] = useState<StepIndex>(0)
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([])
  const [storyName, setStoryName] = useState('')
  const [protagonist, setProtagonist] = useState<CharacterDraft>(emptyCharacter())
  const [characters, setCharacters] = useState<CharacterDraft[]>([emptyCharacter()])
  const [worldSetting, setWorldSetting] = useState('')
  const [era, setEra] = useState('')
  const [additionalElements, setAdditionalElements] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { data: genres = [] } = useQueryWithError({
    queryKey: queryKeys.genres(),
    queryFn: () => genreApi.getGenres(),
  })

  function toggleGenre(id: number) {
    setSelectedGenreIds((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id)
      if (prev.length >= MAX_GENRES) return prev
      return [...prev, id]
    })
  }

  function addCharacter() {
    setCharacters((prev) => [...prev, emptyCharacter()])
  }

  function removeCharacter(idx: number) {
    setCharacters((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateCharacterField(idx: number, field: keyof CharacterDraft, value: string) {
    setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
  }

  function validateStep(s: StepIndex): string {
    if (s === 0) {
      if (!storyName.trim()) return '物語のタイトルを入力してください'
      if (selectedGenreIds.length === 0) return 'ストーリータイプを1つ以上選択してください'
    }
    if (s === 1) {
      if (!worldSetting.trim()) return '世界観設定を入力してください'
      if (!era) return '時代設定を選択してください'
    }
    return ''
  }

  function handleNext() {
    const err = validateStep(step)
    if (err) { setError(err); return }
    setError('')
    setStep((prev) => (prev + 1) as StepIndex)
  }

  function handleBack() {
    setError('')
    setStep((prev) => (prev - 1) as StepIndex)
  }

  async function handleCreate() {
    setError('')
    setSubmitting(true)
    try {
      const story = await storyApi.createStory({
        name: storyName.trim(),
        genreIds: selectedGenreIds,
        worldSetting: worldSetting.trim(),
        era: LABEL_TO_ERA[era],
        additionalElements: additionalElements.trim() || undefined,
      })
      if (protagonist.name.trim()) {
        await characterApi.createCharacter(story.id, {
          name: protagonist.name.trim(),
          isProtagonist: true,
          role: protagonist.role.trim() || undefined,
          gender: protagonist.gender || undefined,
          age: protagonist.age || undefined,
          skills: parseSkills(protagonist.skills),
          overview: protagonist.overview.trim() || undefined,
          appearance: protagonist.appearance.trim() || undefined,
          personality: protagonist.personality.trim() || undefined,
          motivation: protagonist.motivation.trim() || undefined,
          background: protagonist.background.trim() || undefined,
        })
      }
      for (const char of characters) {
        if (!char.name.trim()) continue
        await characterApi.createCharacter(story.id, {
          name: char.name.trim(),
          isProtagonist: false,
          role: char.role.trim() || undefined,
          gender: char.gender || undefined,
          age: char.age.trim() || undefined,
          skills: parseSkills(char.skills),
          overview: char.overview.trim() || undefined,
          appearance: char.appearance.trim() || undefined,
          personality: char.personality.trim() || undefined,
          motivation: char.motivation.trim() || undefined,
          background: char.background.trim() || undefined,
        })
      }
      showToast('物語を作成しました')
      navigate(`/stories/${story.id}`)
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="max-w-[720px] mx-auto pb-12">
      {/* ステップインジケーター */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors ${
                      done
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : active
                          ? 'bg-transparent border-[var(--accent)] text-[var(--accent)]'
                          : 'bg-transparent border-[var(--border)] text-[var(--text)]'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-[10px] whitespace-nowrap ${
                      active ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text)]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 mb-4 transition-colors ${
                      done ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ステップ内容 */}
      {step === 0 && (
        <div className="flex flex-col gap-0.5">
          <div className="px-4 py-3.5 bg-[var(--bg)] border-b border-[var(--border)]">
            <p className="text-[13px] text-[var(--text)] leading-relaxed">
              物語の基本情報を設定します。タイトルはあとから変更できます。ストーリータイプはAIがストーリーを生成するときの指針になります。
            </p>
          </div>
          <div className="bg-[var(--bg)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-1 w-28 shrink-0">
              <span className="font-bold text-sm text-[var(--text-h)]">タイトル</span>
              <RequiredBadge />
            </div>
            <input
              className={inputClass}
              placeholder="物語のタイトルを入力"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
            />
          </div>

          <div className="bg-[var(--bg)] border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <span className="font-bold text-sm text-[var(--text-h)]">ストーリータイプ</span>
              <RequiredBadge />
              <span className="text-xs text-[var(--text)] ml-1">最大3つまで選択</span>
            </div>
            <div className="px-4 py-3.5">
              <div className="flex justify-end mb-3">
                <span className="text-xs text-[var(--text)]">
                  選択中: {selectedGenreIds.length}/{MAX_GENRES}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <ToggleButton
                    key={genre.id}
                    label={genre.name}
                    selected={selectedGenreIds.includes(genre.id)}
                    onClick={() => toggleGenre(genre.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-[var(--bg)] px-4 py-4 flex flex-col gap-3.5">
          <p className="text-[13px] text-[var(--text)] leading-relaxed pb-1 border-b border-[var(--border)]">
            物語の舞台となる世界観を設定します。時代・文化・特殊なルールなど、ストーリーの背景を自由に記述してください。ここで入力した内容をもとにAIがキャラクターやストーリーを生成します。
          </p>
          <div className="flex items-start gap-4">
            <div className="w-28 shrink-0 pt-2 flex items-center gap-1">
              <span className="text-[13px] font-semibold text-[var(--text-h)]">世界観設定</span>
              <RequiredBadge />
            </div>
            <textarea
              className={`${textareaClass} flex-1`}
              placeholder="世界の設定を入力してください"
              value={worldSetting}
              onChange={(e) => setWorldSetting(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0 flex items-center gap-1">
              <span className="text-[13px] font-semibold text-[var(--text-h)]">時代設定</span>
              <RequiredBadge />
            </div>
            <div className="flex gap-2">
              {ERA_OPTIONS.map((e) => (
                <ToggleButton
                  key={e}
                  label={e}
                  selected={era === e}
                  onClick={() => setEra(era === e ? '' : e)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-28 shrink-0 pt-2 flex items-center gap-1">
              <span className="text-[13px] font-semibold text-[var(--text-h)]">追加要素</span>
              <OptionalBadge />
            </div>
            <div className="flex-1">
              <textarea
                className={textareaClass}
                placeholder="例: 魔法、ロボット、異世界、学園、戦争など"
                value={additionalElements}
                maxLength={300}
                onChange={(e) => setAdditionalElements(e.target.value)}
              />
              <div className="text-[11px] text-[var(--text)] text-right mt-0.5">
                {additionalElements.length}/300文字
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="px-4 py-3.5 bg-[var(--bg)] border-b border-[var(--border)]">
            <p className="text-[13px] text-[var(--text)] leading-relaxed">
              物語の中心となる主人公を設定します。名前だけでも登録でき、詳細はあとから編集できます。スキップする場合はそのまま「次へ」を押してください。
            </p>
          </div>
          <ProtagonistFormSection
            value={protagonist}
            onChange={(field, value) => setProtagonist((prev) => ({ ...prev, [field]: value }))}
            simplified
          />
        </>
      )}

      {step === 3 && (
        <>
          <div className="px-4 py-3.5 bg-[var(--bg)] border-b border-[var(--border)]">
            <p className="text-[13px] text-[var(--text)] leading-relaxed">
              主人公以外の登場人物を追加できます。この手順はスキップ可能で、あとからいつでも追加できます。
            </p>
          </div>
          <div>
            {characters.map((char, idx) => (
              <CharacterDraftCard
                key={idx}
                index={idx}
                char={char}
                onChange={(field, value) => updateCharacterField(idx, field, value)}
                onRemove={() => removeCharacter(idx)}
                simplified
                defaultOpen={idx === 0}
              />
            ))}
            <div className="px-4 py-3 bg-[var(--bg)]">
              <DashedAddButton label="登場人物を追加" onClick={addCharacter} />
            </div>
          </div>
        </>
      )}

      {/* ナビゲーション */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 bg-[var(--bg)] border-t border-[var(--border)] mt-0.5">
        {error && <p className="text-[12px] text-red-500 px-1">{error}</p>}
        <div className="flex gap-3">
          {step === 0 ? (
            <Button className="flex-1" onClick={() => navigate('/dashboard')}>
              キャンセル
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleBack} disabled={submitting}>
              戻る
            </Button>
          )}
          {isLastStep ? (
            <Button
              variant="primary"
              className="flex-[2]"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? '作成中...' : '作成する'}
            </Button>
          ) : (
            <Button variant="primary" className="flex-[2]" onClick={handleNext}>
              次へ
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
