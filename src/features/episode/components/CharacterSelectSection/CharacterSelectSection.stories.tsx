import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { CharacterSelectSection } from './CharacterSelectSection'
import type { CharacterDetail } from '../../../character/types'

const mockCharacters: CharacterDetail[] = [
  {
    id: 1,
    initials: '織',
    name: '織田信長',
    role: 'protagonist',
    isProtagonist: true,
    description: '転生した信長。SNSの世界で再び天下を狙う。',
    avatarColor: '#e11d48',
    age: '28',
    gender: '男',
    overview: '転生した信長。SNSの世界で再び天下を狙う。',
    appearance: '黒髪短髪、鋭い目つき。現代風のスーツを好む。',
    personality: '決断力があり、カリスマ性が高い。合理主義者。',
    background: '戦国時代から現代に転生した武将。',
    motivation: 'SNSで天下統一を果たすことを目指す。',
    skills: ['戦略立案', 'カリスマ', 'SNS運営'],
  },
  {
    id: 2,
    initials: '胡',
    name: '胡蝶',
    role: 'ヒロイン',
    isProtagonist: false,
    description: 'シンガーソングライター。SNSの誹謗中傷に苦しむ。',
    avatarColor: '#7c3aed',
    age: '22',
    gender: '女',
    overview: 'シンガーソングライター。SNSの誹謗中傷に苦しむ。',
    appearance: '長い黒髪、はかなげな雰囲気。',
    personality: '繊細で感受性が豊か。内向的だが芯が強い。',
    background: '地方出身のシンガー。SNSで注目を集める。',
    motivation: '純粋に音楽で人を幸せにしたい。',
    skills: ['歌唱', '作曲', '感情表現'],
  },
  {
    id: 3,
    initials: '明',
    name: '明智',
    role: '敵対者',
    isProtagonist: false,
    description: '謎の存在。信長の前に立ちはだかる。',
    avatarColor: '#0ea5e9',
    age: '35',
    gender: '男',
    overview: '謎の存在。信長の前に立ちはだかる。',
    appearance: '端正な顔立ち、白いスーツ。',
    personality: '冷静沈着、計算高い。',
    background: '信長のかつての部下。',
    motivation: '信長を超えることへの執念。',
    skills: ['謀略', '情報収集', 'SNSハッキング'],
  },
]

const meta = {
  title: 'Features/Episode/CharacterSelectSection',
  component: CharacterSelectSection,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CharacterSelectSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { characters: mockCharacters, selectedIds: [], onChange: () => {} },
  render: () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    return (
      <CharacterSelectSection
        characters={mockCharacters}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    )
  },
}

export const WithSelection: Story = {
  args: { characters: mockCharacters, selectedIds: [1, 2], onChange: () => {} },
  render: () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([1, 2])
    return (
      <CharacterSelectSection
        characters={mockCharacters}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    )
  },
}
