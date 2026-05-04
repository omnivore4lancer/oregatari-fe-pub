import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { CharacterDetailModal } from './CharacterDetailModal'

vi.mock('../../../../contexts/ApiErrorContext', () => ({
  useApiError: () => ({ showError: vi.fn() }),
}))

describe('CharacterDetailModal', () => {
  it('characterId=null のとき何も描画されない', () => {
    const { container } = render(
      <MemoryRouter>
        <CharacterDetailModal storyId={1} characterId={null} onClose={vi.fn()} />
      </MemoryRouter>,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
