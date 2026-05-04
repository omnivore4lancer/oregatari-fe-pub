import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NewsCard } from './NewsCard'

describe('NewsCard', () => {
  it('item.title が表示される', () => {
    render(
      <NewsCard
        item={{ id: 1, tag: 'お知らせ', date: '2026年2月', title: 'マンガ作成前にネームが見れるようになりました' }}
      />,
    )
    expect(screen.getByText('マンガ作成前にネームが見れるようになりました')).toBeInTheDocument()
  })
})
