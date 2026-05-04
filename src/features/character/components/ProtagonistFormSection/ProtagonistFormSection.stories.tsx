import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { CharacterDraft } from '../../types'
import { emptyCharacter } from '../../utils'
import { ProtagonistFormSection } from './ProtagonistFormSection'

const filledProtagonist: CharacterDraft = {
  name: '信長（ノブ）',
  role: '転生した戦国武将',
  archetypeRole: '',
  gender: '男性',
  age: '50（前世）/ 転生後',
  skills: '天下布武、カリスマ、戦略立案',
  overview: '本能寺の変で自決した織田信長が現代に転生。前世の記憶と誇りをすべて保持している。',
  appearance: '茶トラの猫の体。小柄だが威圧感のある眼光が特徴。',
  personality: '傲慢かつ合理的。感情を表に出さないが、胡蝶にだけは心を動かされている。',
  motivation: '現代でも天下を取ること。そして胡蝶を守ること。',
  background: '戦国時代の覇者・織田信長。本能寺の変で明智光秀に謀反を起こされ自決した。',
}

const meta = {
  title: 'Features/Character/ProtagonistFormSection',
  component: ProtagonistFormSection,
  parameters: { layout: 'padded' },
  args: {
    value: emptyCharacter(),
    onChange: () => {},
  },
} satisfies Meta<typeof ProtagonistFormSection>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState<CharacterDraft>(emptyCharacter())
    return (
      <div className="max-w-[720px]">
        <ProtagonistFormSection
          value={value}
          onChange={(field, v) => setValue((prev) => ({ ...prev, [field]: v }))}
        />
      </div>
    )
  },
}

export const Filled: Story = {
  render: () => {
    const [value, setValue] = useState<CharacterDraft>(filledProtagonist)
    return (
      <div className="max-w-[720px]">
        <ProtagonistFormSection
          value={value}
          onChange={(field, v) => setValue((prev) => ({ ...prev, [field]: v }))}
        />
      </div>
    )
  },
}
