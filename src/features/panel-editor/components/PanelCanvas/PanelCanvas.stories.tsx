import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { PanelCanvas } from './PanelCanvas'
import type { Panel } from '../../types'

const singlePanel: Panel[] = [
  { id: 'p1', vertices: [[0, 0], [1, 0], [1, 1], [0, 1]], prompt: '', imageUrl: null },
]

const threePanel: Panel[] = [
  { id: 'p1', vertices: [[0, 0], [1, 0], [1, 0.5], [0, 0.5]], prompt: '', imageUrl: null },
  { id: 'p2', vertices: [[0, 0.5], [0.5, 0.5], [0.5, 1], [0, 1]], prompt: '', imageUrl: null },
  { id: 'p3', vertices: [[0.5, 0.5], [1, 0.5], [1, 1], [0.5, 1]], prompt: '', imageUrl: null },
]

const meta = {
  title: 'Features/PanelEditor/PanelCanvas',
  component: PanelCanvas,
  parameters: { layout: 'centered' },
  args: {
    panels: singlePanel,
    selectedId: null,
    onSelect: () => {},
    onChange: () => {},
  },
} satisfies Meta<typeof PanelCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const SinglePanel: Story = {
  render: () => {
    const [panels, setPanels] = useState<Panel[]>(singlePanel)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    return (
      <div className="w-56">
        <PanelCanvas panels={panels} selectedId={selectedId} onSelect={setSelectedId} onChange={setPanels} />
      </div>
    )
  },
}

export const ThreePanels: Story = {
  render: () => {
    const [panels, setPanels] = useState<Panel[]>(threePanel)
    const [selectedId, setSelectedId] = useState<string | null>('p1')
    return (
      <div className="w-56">
        <PanelCanvas panels={panels} selectedId={selectedId} onSelect={setSelectedId} onChange={setPanels} />
      </div>
    )
  },
}
