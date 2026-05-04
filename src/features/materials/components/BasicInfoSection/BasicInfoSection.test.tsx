import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BasicInfoSection } from './BasicInfoSection'
import type { MaterialBasicForm } from '../../types'

const defaultValues: MaterialBasicForm = {
  name: '',
  groupId: '未分類',
  description: '',
  aspectRatio: '16:9（横長）',
  artStyle: '標準（アニメ背景）',
}

describe('BasicInfoSection', () => {
  it('「基本情報」が表示される', () => {
    render(<BasicInfoSection values={defaultValues} onChange={vi.fn()} />)
    expect(screen.getByText('基本情報')).toBeInTheDocument()
  })
})
