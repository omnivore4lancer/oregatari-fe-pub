import type { Meta, StoryObj } from '@storybook/react-vite'

import { CoverImagePreview } from './CoverImagePreview'

const meta = {
  title: 'Features/Publish/CoverImagePreview',
  component: CoverImagePreview,
  parameters: { layout: 'padded' },
  args: {
    isGenerating: false,
    imageUrl: null,
  },
} satisfies Meta<typeof CoverImagePreview>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Generating: Story = {
  args: { isGenerating: true },
}

export const WithImage: Story = {
  args: { imageUrl: 'https://picsum.photos/seed/cover/360/480' },
}
