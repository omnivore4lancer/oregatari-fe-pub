import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SceneDescSection } from './SceneDescSection'
import type { MaterialSceneForm } from '../../types'

const emptyValues: MaterialSceneForm = {
  locationMain: '',
  locationDetail: '',
  worldSetting: '',
  timeSlot: '夜',
  weather: '晴れ',
  skyDesc: '',
  lighting: '',
}

describe('SceneDescSection', () => {
  it('「シーンの説明」見出しが表示される', () => {
    render(<SceneDescSection values={emptyValues} onChange={vi.fn()} />)
    expect(screen.getByText('シーンの説明')).toBeInTheDocument()
  })
})
