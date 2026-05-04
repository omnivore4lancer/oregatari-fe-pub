import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

import { RelationshipGraph } from './RelationshipGraph'

vi.mock('../../../../contexts/ApiErrorContext', () => ({
  useApiError: () => ({ showError: vi.fn() }),
}))
vi.mock('../../../../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))
vi.mock('../../api/characterRelationshipApi', () => ({
  characterRelationshipApi: {
    deleteRelationship: vi.fn(),
    updateRelationship: vi.fn(),
  },
}))

describe('RelationshipGraph', () => {
  it('描画される（相関図ヘッダーが表示される）', () => {
    render(
      <RelationshipGraph
        storyId={1}
        characters={[
          { id: 1, initials: '織', name: '織田信長', role: 'protagonist', isProtagonist: true, archetypeRole: null },
        ]}
        relationships={[]}
      />,
    )
    expect(screen.getByText('相関図')).toBeInTheDocument()
  })
})
