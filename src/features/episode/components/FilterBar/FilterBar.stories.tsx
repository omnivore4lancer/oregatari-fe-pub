import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilterBar } from './FilterBar'
import type { FilterTab } from '../../types'

const meta = {
  title: 'Features/Episode/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
  args: {
    active: 'all',
    onChange: () => {},
  },
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState<FilterTab>('all')
    return <FilterBar active={active} onChange={setActive} />
  },
}

export const WithActive: Story = {
  render: () => {
    const [active, setActive] = useState<FilterTab>('続編')
    return <FilterBar active={active} onChange={setActive} />
  },
}
