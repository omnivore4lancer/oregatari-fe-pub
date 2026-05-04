import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'

describe('Select', () => {
  it('options を渡したとき option 要素が描画される', () => {
    render(<Select value="" onChange={vi.fn()} options={['りんご', 'みかん', 'ぶどう']} />)
    expect(screen.getByRole('option', { name: 'りんご' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'みかん' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'ぶどう' })).toBeInTheDocument()
  })

  it('placeholder を渡したとき空値のオプションが描画される', () => {
    render(<Select value="" onChange={vi.fn()} options={['りんご']} placeholder="選択してください" />)
    expect(screen.getByRole('option', { name: '選択してください' })).toBeInTheDocument()
  })

  it('選択変更で onChange が呼ばれる', async () => {
    const onChange = vi.fn()
    render(<Select value="" onChange={onChange} options={['りんご', 'みかん']} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'りんご')
    expect(onChange).toHaveBeenCalledWith('りんご')
  })
})
