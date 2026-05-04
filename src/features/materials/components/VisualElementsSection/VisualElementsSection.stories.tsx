import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { VisualElementsSection } from './VisualElementsSection'
import type { MaterialVisualForm } from '../../types'

const emptyValues: MaterialVisualForm = {
  fgLStructure: '', fgLTexture: '', fgLFurniture: '', fgLProps: '',
  mgCGround: '', mgCDecoration: '', mgCAtmosphere: '',
  mgRStructure: '', mgRItems: '',
  bgBuilding: '', bgTerrain: '',
}

const meta = {
  title: 'Features/Materials/VisualElementsSection',
  component: VisualElementsSection,
  parameters: { layout: 'padded' },
  args: {
    values: emptyValues,
    onChange: () => {},
  },
} satisfies Meta<typeof VisualElementsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [values, setValues] = useState(emptyValues)
    return (
      <VisualElementsSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
      />
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [values, setValues] = useState<MaterialVisualForm>({
      fgLStructure: '本棚',
      fgLTexture: '木目調の床',
      fgLFurniture: 'テーブル\nソファ\nギタースタンド',
      fgLProps: '楽譜\nコーヒーカップ\nスマホ',
      mgCGround: 'フローリング',
      mgCDecoration: 'ポスター\n観葉植物',
      mgCAtmosphere: '生活感のある温かさ',
      mgRStructure: '窓枠',
      mgRItems: 'カーテン\n雨粒',
      bgBuilding: '向かいのビル',
      bgTerrain: '都市の夜景',
    })
    return (
      <VisualElementsSection
        values={values}
        onChange={(updates) => setValues((prev) => ({ ...prev, ...updates }))}
      />
    )
  },
}
