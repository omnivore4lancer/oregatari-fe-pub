import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  DashedAddButton,
  Field,
  inputClass,
  PageHeader,
  SectionHeader,
  Select,
  textareaClass,
} from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import {
  ARCHETYPE_ROLE_LABELS,
  characterApi,
} from '../../features/character'
import type { ArchetypeRole, CreateCharacterInput } from '../../features/character'
import { queryKeys } from '../../lib/queryKeys'

export default function CharacterCreatePage() {
  const navigate = useNavigate()
  const { id, charId } = useParams()
  const storyId = Number(id)
  const isEdit = charId !== undefined
  const characterId = isEdit ? Number(charId) : undefined
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [archetypeRole, setArchetypeRole] = useState<ArchetypeRole | ''>('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [overview, setOverview] = useState('')
  const [appearance, setAppearance] = useState('')
  const [personality, setPersonality] = useState('')
  const [motivation, setMotivation] = useState('')
  const [background, setBackground] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit || characterId === undefined) return
    characterApi
      .getCharacter(storyId, characterId)
      .then((r) => {
        setName(r.name)
        setRole(r.role ?? '')
        setArchetypeRole((r.archetypeRole ?? '') as ArchetypeRole | '')
        setAge(r.age ?? '')
        setGender(r.gender ?? '')
        setOverview(r.overview ?? '')
        setAppearance(r.appearance ?? '')
        setPersonality(r.personality ?? '')
        setMotivation(r.motivation ?? '')
        setBackground(r.background ?? '')
        setSkills(r.skills)
      })
      .catch(showError)
  }, [isEdit, storyId, characterId, showError])

  function handleBack() {
    if (isEdit) {
      navigate(`/stories/${id}/characters/${charId}`)
    } else {
      navigate(`/stories/${id}/characters`)
    }
  }

  function addSkill() {
    setSkills((prev) => [...prev, ''])
  }

  function updateSkill(idx: number, value: string) {
    setSkills((prev) => prev.map((s, i) => (i === idx ? value : s)))
  }

  function removeSkill(idx: number) {
    setSkills((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit() {
    if (!name.trim() || (characterId === undefined && isEdit)) return
    setSubmitting(true)
    try {
      const payload: CreateCharacterInput = {
        name: name.trim(),
        role: role.trim() || undefined,
        archetypeRole: archetypeRole || undefined,
        age: age.trim() || undefined,
        gender: gender.trim() || undefined,
        overview: overview.trim() || undefined,
        appearance: appearance.trim() || undefined,
        personality: personality.trim() || undefined,
        motivation: motivation.trim() || undefined,
        background: background.trim() || undefined,
        skills: skills.filter((s) => s.trim()),
      }
      if (isEdit && characterId !== undefined) {
        await characterApi.updateCharacter(storyId, characterId, payload)
        queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
        showToast('キャラクターを保存しました')
        navigate(`/stories/${id}/characters/${charId}`)
      } else {
        await characterApi.createCharacter(storyId, payload)
        queryClient.invalidateQueries({ queryKey: queryKeys.characters(storyId) })
        showToast('キャラクターを作成しました')
        navigate(`/stories/${id}/characters`)
      }
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }

  const submitLabel = submitting
    ? isEdit
      ? '保存中...'
      : '作成中...'
    : isEdit
      ? '保存する'
      : '作成する'

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? 'プロフィール編集' : '新規キャラクター作成'}
        description="キャラクターの基本情報と詳細を入力してください。"
        onBack={handleBack}
        actions={
          <>
            <Button onClick={handleBack}>キャンセル</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting || !name.trim()}>
              {submitLabel}
            </Button>
          </>
        }
      />

      <section className="mb-8">
        <SectionHeader title="基本情報" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label="名前" required>
            <input
              className={inputClass}
              placeholder="例: 佐藤 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="役割">
            <input
              className={inputClass}
              placeholder="例: 主人公の友人"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Field>
          <Field label="配役">
            <Select
              value={archetypeRole}
              onChange={(v) => setArchetypeRole(v as ArchetypeRole | '')}
              placeholder="未設定（任意）"
              labeledOptions={Object.entries(ARCHETYPE_ROLE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="年齢">
            <input
              className={inputClass}
              placeholder="例: 17歳"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Field>
          <Field label="性別">
            <input
              className={inputClass}
              placeholder="例: 男性"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="詳細設定" />
        <div className="flex flex-col gap-4">
          <Field label="概要・特徴">
            <textarea
              className={`${textareaClass} min-h-[90px]`}
              placeholder="キャラクターの全体的な説明..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />
          </Field>
          <Field label="デフォルトの見た目（衣装など）">
            <textarea
              className={`${textareaClass} min-h-[90px]`}
              placeholder="例: 白いワンピース、長い黒髪、青い瞳..."
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
            />
          </Field>
          <Field label="性格">
            <textarea
              className={`${textareaClass} min-h-[90px]`}
              placeholder="性格や行動原理..."
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
            />
          </Field>
          <Field label="動機・目標">
            <textarea
              className={`${textareaClass} min-h-[90px]`}
              placeholder="物語における目的..."
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </Field>
          <Field label="背景・生い立ち">
            <textarea
              className={`${textareaClass} min-h-[90px]`}
              placeholder="過去の経歴など..."
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader title="スキル・能力" />
        <div className="flex flex-col gap-2">
          {skills.map((skill, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                className={`${inputClass} flex-1`}
                placeholder="例: 剣術、魔法、料理"
                value={skill}
                onChange={(e) => updateSkill(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="px-2 text-[var(--text)] hover:text-red-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
          <DashedAddButton label="スキルを追加" onClick={addSkill} />
        </div>
      </section>
    </div>
  )
}
