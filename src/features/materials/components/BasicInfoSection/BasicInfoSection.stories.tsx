import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { BasicInfoSection } from './BasicInfoSection'
import type { MaterialBasicForm } from '../../types'

const defaultValues: MaterialBasicForm = {
  name: '',
  groupId: '未分類',
  description: '',
  aspectRatio: '16:9（横長）',
  artStyle: '標準（アニメ背景）',
}

const meta = {
  title: 'Features/Materials/BasicInfoSection',
  component: BasicInfoSection,
  parameters: { layout: 'padded' },
  args: {
    values: defaultValues,
    onChange: () => {},
  },
} satisfies Meta<typeof BasicInfoSection>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [values, setValues] = useState(defaultValues)
    return (
      <BasicInfoSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
        groups={[{ id: 'uncategorized', label: '未分類' }, { id: 'bg', label: '背景' }]}
      />
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [values, setValues] = useState<MaterialBasicForm>({
      name: '胡蝶の部屋',
      groupId: '未分類',
      description: 'シンガーソングライターとして活躍している女性の一人暮らしの部屋',
      aspectRatio: '16:9（横長）',
      artStyle: 'ウォーターカラー',
    })
    return (
      <BasicInfoSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
        groups={[{ id: 'uncategorized', label: '未分類' }]}
      />
    )
  },
}
