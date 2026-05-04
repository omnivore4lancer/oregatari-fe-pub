import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepNav } from './StepNav'

const meta = {
  title: 'Features/Episode/StepNav',
  component: StepNav,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepNav>

export default meta
type Story = StoryObj<typeof meta>

export const Step0: Story = { args: { currentStep: 0 } }
export const Step1: Story = { args: { currentStep: 1 } }
export const Step2: Story = { args: { currentStep: 2 } }
