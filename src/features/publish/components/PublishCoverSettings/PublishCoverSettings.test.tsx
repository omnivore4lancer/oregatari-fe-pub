import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PublishCoverSettings } from './PublishCoverSettings'
import type { Character } from '../../../character/types'

const mockCharacter: Character = {
  id: 1,
  name: '田中太郎',
  role: '主人公',
  isProtagonist: true,
  description: '勇敢な侍',
  initials: '田',
  avatarColor: '#6366f1',
  imageUrl: null,
}

const defaultProps = {
  characters: [mockCharacter],
  selectedCharIds: [],
  onToggleChar: vi.fn(),
  selectedStyle: null,
  onStyleChange: vi.fn(),
  selectedLayout: null,
  onLayoutChange: vi.fn(),
  description: '',
  onDescriptionChange: vi.fn(),
  activeTab: 0,
  onTabChange: vi.fn(),
  completedSteps: 0,
  isGeneratingCover: false,
  onGenerateCoverImage: vi.fn(),
  onSave: vi.fn(),
  publishedAt: null,
  isPublishing: false,
  onPublish: vi.fn(),
  onUnpublish: vi.fn(),
}

describe('PublishCoverSettings', () => {
  it('キャラクター一覧を表示する', () => {
    render(<PublishCoverSettings {...defaultProps} />)
    expect(screen.getByText('田中太郎')).toBeInTheDocument()
  })

  it('キャラクタークリックで onToggleChar が呼ばれる', async () => {
    const onToggleChar = vi.fn()
    render(<PublishCoverSettings {...defaultProps} onToggleChar={onToggleChar} />)
    await userEvent.click(screen.getByText('田中太郎'))
    expect(onToggleChar).toHaveBeenCalledWith(1)
  })

  it('publishedAt がある場合は公開取り下げボタンを表示する', () => {
    render(<PublishCoverSettings {...defaultProps} publishedAt="2024-01-01T00:00:00Z" />)
    expect(screen.getByText('公開取り下げ')).toBeInTheDocument()
  })

  it('publishedAt がない場合は公開するボタンを表示する', () => {
    render(<PublishCoverSettings {...defaultProps} />)
    expect(screen.getByText('公開する')).toBeInTheDocument()
  })

  it('completedSteps を表示する', () => {
    render(<PublishCoverSettings {...defaultProps} completedSteps={2} />)
    expect(screen.getByText('2/4 完了中')).toBeInTheDocument()
  })
})
