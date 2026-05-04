import type { Meta, StoryObj } from '@storybook/react-vite'

import { StorySectionBlock } from './StorySectionBlock'

const meta = {
  title: 'Features/Story/StorySectionBlock',
  component: StorySectionBlock,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StorySectionBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Intro: Story = {
  args: {
    tag: '導入',
    content: '「ノフ」と名乗る男。SNSのアルゴリズムで暗躍する謎の存在、関係者は「天才」として評価しながらも、事件は当初のものにした後、さらなる陰謀の渦に巻き込まれていく。',
  },
}

export const Climax: Story = {
  args: {
    tag: 'クライマックス',
    content: '遂に明智との直接対決。信長は己の信念を試される。「是非に及ばず」——あの言葉が再び脳裏をよぎる。',
  },
}

export const AllSections: Story = {
  render: () => (
    <div className="max-w-lg">
      <StorySectionBlock tag="導入" content="主人公が現代に転生し、SNSの世界に戸惑いながらも行動を開始する。" />
      <StorySectionBlock tag="展開" content="SNS上での戦いが激化。次第に明智の陰謀が明らかになっていく。" />
      <StorySectionBlock tag="クライマックス" content="遂に明智との直接対決。信長は己の信念を試される。" />
      <StorySectionBlock tag="結末" content="戦いが終わり、信長は新たな時代の幕開けを目撃する。" />
    </div>
  ),
}
