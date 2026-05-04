import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StorySectionBlock } from './StorySectionBlock'

describe('StorySectionBlock', () => {
  it('section の内容が表示される', () => {
    render(<StorySectionBlock tag="導入" content="主人公が現代に転生した。" />)
    expect(screen.getByText('【導入】')).toBeInTheDocument()
    expect(screen.getByText('主人公が現代に転生した。')).toBeInTheDocument()
  })
})
