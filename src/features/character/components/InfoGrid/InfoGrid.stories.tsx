import type { Meta, StoryObj } from '@storybook/react-vite'

import { InfoGrid } from './InfoGrid'
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
  overview: '役没した物語の障害として現れる存在。表向きは穏やかだが内に秘めた執念は深い。',
  appearance: '黒い着物に白い羽織。切れ長の目が特徴。',
  personality: '冷静で計算高い。感情を表に出さない。他者の心理を読むことに長けている。',
  background: '武家の出身。幼少期に家族を失い、以来単独で生き抜いてきた。',
  motivation: '天下布武への報復。かつての主君への忠誠心が変質した歪んだ愛。',
  skills: ['剣術', '謀略', '洞察力', '変装', '交渉術'],
}

const meta = {
  title: 'Features/Character/InfoGrid',
  component: InfoGrid,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InfoGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { character: mockCharacter },
}
