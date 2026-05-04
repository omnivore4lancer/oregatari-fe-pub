import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { PublishCoverSettings } from './PublishCoverSettings'
import type { Character } from '../../../character/types'

const mockCharacters: Character[] = [
  {
    id: 1,
    name: '田中太郎',
    role: '主人公',
    isProtagonist: true,
    description: '勇敢な侍',
    initials: '田',
    avatarColor: '#6366f1',
    imageUrl: null,
  },
  {
    id: 2,
    name: '鈴木花子',
    role: 'ヒロイン',
    isProtagonist: false,
    description: '謎めいた少女',
    initials: '鈴',
    avatarColor: '#ec4899',
    imageUrl: null,
  },
]

const meta = {
  title: 'Features/Publish/PublishCoverSettings',
  component: PublishCoverSettings,
  parameters: { layout: 'padded' },
  args: {
    characters: mockCharacters,
    selectedCharIds: [],
    onToggleChar: () => {},
    selectedStyle: null,
    onStyleChange: () => {},
    selectedLayout: null,
    onLayoutChange: () => {},
    description: '',
    onDescriptionChange: () => {},
    activeTab: 0,
    onTabChange: () => {},
    completedSteps: 0,
    isGeneratingCover: false,
    onGenerateCoverImage: () => {},
    onSave: () => {},
    publishedAt: null,
    isPublishing: false,
    onPublish: () => {},
    onUnpublish: () => {},
  },
} satisfies Meta<typeof PublishCoverSettings>

export default meta
type Story = StoryObj<typeof meta>

export const CharacterTab: Story = {}

export const StyleTab: Story = {
  args: { activeTab: 1, selectedCharIds: [1] },
}

export const LayoutTab: Story = {
  args: { activeTab: 2, selectedCharIds: [1] },
}

export const DescriptionTab: Story = {
  args: { activeTab: 3, selectedCharIds: [1] },
}

export const Published: Story = {
  args: { publishedAt: '2024-01-01T00:00:00Z', completedSteps: 4, selectedCharIds: [1] },
}

export const Interactive: Story = {
  render: () => {
    const [selectedCharIds, setSelectedCharIds] = useState<number[]>([])
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
    const [selectedLayout, setSelectedLayout] = useState<string | null>(null)
    const [description, setDescription] = useState('')
    const [activeTab, setActiveTab] = useState(0)
    const completedSteps = [
      selectedCharIds.length > 0,
      selectedStyle !== null,
      selectedLayout !== null,
      description.length > 0,
    ].filter(Boolean).length

    return (
      <PublishCoverSettings
        characters={mockCharacters}
        selectedCharIds={selectedCharIds}
        onToggleChar={(id) => setSelectedCharIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
        description={description}
        onDescriptionChange={setDescription}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedSteps={completedSteps}
        isGeneratingCover={false}
        onGenerateCoverImage={() => {}}
        onSave={() => {}}
        publishedAt={null}
        isPublishing={false}
        onPublish={() => {}}
        onUnpublish={() => {}}
      />
    )
  },
}
