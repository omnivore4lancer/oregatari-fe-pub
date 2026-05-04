import type { Meta, StoryObj } from '@storybook/react-vite'

import { DesignSection } from './DesignSection'
import type { CharacterDetail } from '../../types'

const mockCharacter: CharacterDetail = {
  id: '1',
  initials: '明',
  name: '明智（あけち）',
  role: '役没・物語の障害',
  description: '謎めいた存在。真の目的は誰にも分からない。',
  avatarColor: '#7c3aed',
  age: '28',
  gender: '男',
  overview: '役没した物語の障害として現れる存在。',
  appearance: '黒い着物に白い羽織。切れ長の目が特徴。肌は青白く、静寂の中に鋭さが宿る。',
  personality: '冷静で計算高い。感情を表に出さない。',
  background: '武家の出身。幼少期に家族を失う。',
  motivation: '天下布武への報復。主君への忠誠心。',
  skills: ['剣術', '謀略', '洞察力', '変装'],
}

const meta = {
  title: 'Features/Character/DesignSection',
  component: DesignSection,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DesignSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { character: mockCharacter },
}
