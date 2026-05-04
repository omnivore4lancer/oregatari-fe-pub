import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CharacterDraftCard } from './CharacterDraftCard'
import type { CharacterDraft } from '../../types'

const emptyChar: CharacterDraft = {
  name: '',
  role: '',
  archetypeRole: '',
  gender: '',
  age: '',
  skills: '',
  overview: '',
  appearance: '',
  personality: '',
  motivation: '',
  background: '',
}

describe('CharacterDraftCard', () => {
  it('折りたたまれた状態で「登場人物 1」が表示される', () => {
    render(
      <CharacterDraftCard index={0} char={emptyChar} onChange={vi.fn()} onRemove={vi.fn()} />,
    )
    expect(screen.getByText('登場人物 1')).toBeInTheDocument()
  })

  it('defaultOpen=true で名前欄が表示される', () => {
    render(
      <CharacterDraftCard index={0} char={emptyChar} onChange={vi.fn()} onRemove={vi.fn()} defaultOpen />,
    )
    expect(screen.getByPlaceholderText('登場人物の名前')).toBeInTheDocument()
  })

  it('削除ボタンクリックで onRemove が呼ばれる', async () => {
    const onRemove = vi.fn()
    render(
      <CharacterDraftCard index={0} char={emptyChar} onChange={vi.fn()} onRemove={onRemove} />,
    )
    await userEvent.click(screen.getByRole('button', { name: '削除' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
