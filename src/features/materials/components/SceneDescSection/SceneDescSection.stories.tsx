import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SceneDescSection } from './SceneDescSection'
import type { MaterialSceneForm } from '../../types'

const emptyValues: MaterialSceneForm = {
  locationMain: '',
  locationDetail: '',
  worldSetting: '',
  timeSlot: '夜',
  weather: '晴れ',
  skyDesc: '',
  lighting: '',
}

const meta = {
  title: 'Features/Materials/SceneDescSection',
  component: SceneDescSection,
  parameters: { layout: 'padded' },
  args: {
    values: emptyValues,
    onChange: () => {},
  },
} satisfies Meta<typeof SceneDescSection>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [values, setValues] = useState(emptyValues)
    return (
      <SceneDescSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
      />
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [values, setValues] = useState<MaterialSceneForm>({
      locationMain: '一人暮らしの部屋',
      locationDetail: '東京・渋谷区',
      worldSetting: '現代日本',
      timeSlot: '夜',
      weather: '雨',
      skyDesc: '厚い雲に覆われた夜空。星は見えない。',
      lighting: '室内の温かみのある間接照明。窓には雨粒が伝う。',
    })
    return (
      <SceneDescSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
      />
    )
  },
}
