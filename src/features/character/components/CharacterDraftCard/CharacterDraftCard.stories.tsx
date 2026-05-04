import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { CharacterDraft } from '../../types'
import { emptyCharacter } from '../../utils'
import { CharacterDraftCard } from './CharacterDraftCard'

const filledChar: CharacterDraft = {
  name: '明智（あけち）',
  role: '敵役・物語の障害',
  archetypeRole: '',
  gender: '男性',
  age: '38才',
  skills: '策略、話術、人脈',
  overview: '胡蝶の所属する芸能事務所のマネージャー。表向きは温厚な人物。',
  appearance: '清潔感のあるスーツ姿。切れ長の目が特徴的。',
  personality: '表向きは温厚だが、裏では打算的。感情を表に出さない。',
  motivation: '胡蝶を炎上させて話題作りに利用すること。',
  background: '大手芸能事務所出身。業界歴15年のベテラン。',
}

const meta = {
  title: 'Features/Character/CharacterDraftCard',
  component: CharacterDraftCard,
  parameters: { layout: 'padded' },
  args: {
    index: 0,
    char: filledChar,
    onChange: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof CharacterDraftCard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [char, setChar] = useState<CharacterDraft>(emptyCharacter())
    return (
      <div className="max-w-[600px]">
        <CharacterDraftCard
          index={0}
          char={char}
          onChange={(field, value) => setChar((prev) => ({ ...prev, [field]: value }))}
          onRemove={() => {}}
        />
      </div>
    )
  },
}

export const Filled: Story = {
  render: () => {
    const [char, setChar] = useState<CharacterDraft>(filledChar)
    return (
      <div className="max-w-[600px]">
        <CharacterDraftCard
          index={1}
          char={char}
          onChange={(field, value) => setChar((prev) => ({ ...prev, [field]: value }))}
          onRemove={() => {}}
        />
      </div>
    )
  },
}

export const MultipleCards: Story = {
  render: () => {
    const [chars, setChars] = useState<CharacterDraft[]>([emptyCharacter(), filledChar])
    return (
      <div className="max-w-[600px]">
        {chars.map((c, idx) => (
          <CharacterDraftCard
            key={idx}
            index={idx}
            char={c}
            onChange={(field, value) =>
              setChars((prev) => prev.map((ch, i) => (i === idx ? { ...ch, [field]: value } : ch)))
            }
            onRemove={() => setChars((prev) => prev.filter((_, i) => i !== idx))}
          />
        ))}
      </div>
    )
  },
}
