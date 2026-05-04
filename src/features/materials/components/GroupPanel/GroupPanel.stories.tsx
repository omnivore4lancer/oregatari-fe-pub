import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { GroupPanel } from './GroupPanel'
import type { GroupItem } from './GroupPanel'

const initialGroups: GroupItem[] = [
  { id: 'uncategorized', label: '未分類' },
  { id: 'bg', label: '背景' },
  { id: 'char', label: 'キャラクター' },
]

const meta = {
  title: 'Features/Materials/GroupPanel',
  component: GroupPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    groups: initialGroups,
    activeGroup: 'uncategorized',
    onSelectGroup: () => {},
  },
} satisfies Meta<typeof GroupPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [groups, setGroups] = useState(initialGroups)
    const [activeGroup, setActiveGroup] = useState('uncategorized')
    return (
      <div className="flex h-64 border border-[var(--border)]">
        <GroupPanel
          groups={groups}
          activeGroup={activeGroup}
          onSelectGroup={setActiveGroup}
          onAddGroup={(name) =>
            setGroups((prev) => [...prev, { id: name, label: name }])
          }
        />
      </div>
    )
  },
}
