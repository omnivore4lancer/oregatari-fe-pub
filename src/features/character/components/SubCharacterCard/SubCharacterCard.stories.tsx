import type { Meta, StoryObj } from '@storybook/react-vite'

import { SubCharacterCard } from './SubCharacterCard'
import type { Character } from '../../types'

const chars: Character[] = [
  {
    id: '1',
    initials: '胡',
    name: '胡蝶',
    role: 'ヒロイン',
    description: 'シンガーソングライターとして活躍する女性。SNSの誹謗中傷に苦しむ。',
    avatarColor: '#7c3aed',
  },
  {
    id: '2',
    initials: '木',
    name: '木下藤吉郎',
    role: '盟友・協力者',
    description: '信長を陰で支える存在。軽妙な口調の裏に鋭い洞察を持つ。',
    avatarColor: '#0ea5e9',
  },
]

const meta = {
  title: 'Features/Character/SubCharacterCard',
  component: SubCharacterCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SubCharacterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { character: chars[0] },
}

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      {chars.map((c) => (
        <SubCharacterCard key={c.id} character={c} onClick={() => {}} />
      ))}
    </div>
  ),
}
