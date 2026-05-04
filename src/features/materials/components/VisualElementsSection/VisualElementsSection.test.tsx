import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VisualElementsSection } from './VisualElementsSection'
import type { MaterialVisualForm } from '../../types'

const emptyValues: MaterialVisualForm = {
  fgLStructure: '', fgLTexture: '', fgLFurniture: '', fgLProps: '',
  mgCGround: '', mgCDecoration: '', mgCAtmosphere: '',
  mgRStructure: '', mgRItems: '',
  bgBuilding: '', bgTerrain: '',
}

describe('VisualElementsSection', () => {
  it('「ビジュアル要素の内訳」見出しが表示される', () => {
    render(<VisualElementsSection values={emptyValues} onChange={vi.fn()} />)
    expect(screen.getByText('ビジュアル要素の内訳')).toBeInTheDocument()
  })
})
