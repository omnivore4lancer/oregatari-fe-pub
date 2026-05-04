import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepBadge } from './StepBadge'

const meta = {
  title: 'Features/Publish/StepBadge',
  component: StepBadge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StepBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Step1: Story = { args: { n: '1' } }
export const Step2: Story = { args: { n: '2' } }
export const Step3: Story = { args: { n: '3' } }

export const AllSteps: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StepBadge n="1" />
      <StepBadge n="2" />
      <StepBadge n="3" />
    </div>
  ),
}
