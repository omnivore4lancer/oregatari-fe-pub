import type { Meta, StoryObj } from '@storybook/react-vite'

import { SubNav } from './SubNav'

const meta = {
  title: 'UI/SubNav',
  component: SubNav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SubNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
