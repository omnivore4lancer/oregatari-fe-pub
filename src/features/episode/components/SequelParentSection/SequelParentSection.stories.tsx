import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { Episode } from '../../types'
import { SequelParentSection } from './SequelParentSection'

const mockEpisodes: Episode[] = [
  {
    id: 1,
    number: 1,
    title: '信長SNSデビュー',
    status: '未公開',
    relation: '単独',
    description:
      'SNSの誹謗中傷に悩む胡蝶の姿を見て、ふと自分がスマホを操作して、人間として胡蝶をバッシングする屋をSNS上で成敗してやろうと思い立つ、胡蝶のスマホを、握てい...',
    createdAt: '2026/04/22',
    generatingState: 'generating',
    content: '',
    characterIds: [],
    inheritRelation: false,
    hasScenes: false,
  },
  {
    id: 2,
    number: 2,
    title: '醒い',
    status: '未公開',
    relation: '続編',
    description:
      '信長がSNSで胡蝶のバッシャーを成敗したことで、胡蝶の炎上は一時収束する。しかし明智の次の一手が静かに動き始め、信長は飼い猫として胡蝶の傍らで異変を察知する...',
    createdAt: '2026/04/23',
    generatingState: 'done',
    content: '',
    characterIds: [],
    inheritRelation: true,
    hasScenes: true,
  },
]

const meta = {
  title: 'Features/Episode/SequelParentSection',
  component: SequelParentSection,
  parameters: { layout: 'padded' },
  args: {
    episodes: mockEpisodes,
    selectedId: null,
    onSelect: () => {},
  },
} satisfies Meta<typeof SequelParentSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    return (
      <SequelParentSection
        episodes={mockEpisodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    )
  },
}

export const WithSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<number | null>(1)
    return (
      <SequelParentSection
        episodes={mockEpisodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    )
  },
}
