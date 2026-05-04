import type { Meta, StoryObj } from '@storybook/react-vite'

import { OptionalBadge, RequiredBadge } from './Badge'

const meta = {
  title: 'UI/Badge',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta

export const Required: StoryObj = {
  render: () => <RequiredBadge />,
}

export const Optional: StoryObj = {
  render: () => <OptionalBadge />,
}

export const Both: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <RequiredBadge />
      <OptionalBadge />
    </div>
  ),
}
