import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ToggleButton } from './ToggleButton'

const meta = {
  title: 'UI/ToggleButton',
  component: ToggleButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Unselected: Story = {
  args: { label: '現代', selected: false, onClick: () => {} },
}

export const Selected: Story = {
  args: { label: '現代', selected: true, onClick: () => {} },
}

export const EraGroup: Story = {
  render: () => {
    const OPTIONS = ['現代', '古代/中世', '未来/SF']
    const [selected, setSelected] = useState('現代')
    return (
      <div className="flex gap-2">
        {OPTIONS.map((o) => (
          <ToggleButton
            key={o}
            label={o}
            selected={selected === o}
            onClick={() => setSelected(o)}
          />
        ))}
      </div>
    )
  },
}

export const GenreGroup: Story = {
  render: () => {
    const GENRES = ['ファンタジー', 'ロマンス', 'ミステリー', 'SF', 'ホラー', '日常']
    const [selected, setSelected] = useState<string[]>([])
    function toggle(g: string) {
      setSelected((prev) =>
        prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
      )
    }
    return (
      <div className="grid grid-cols-3 gap-2">
        {GENRES.map((g) => (
          <ToggleButton key={g} label={g} selected={selected.includes(g)} onClick={() => toggle(g)} />
        ))}
      </div>
    )
  },
}
