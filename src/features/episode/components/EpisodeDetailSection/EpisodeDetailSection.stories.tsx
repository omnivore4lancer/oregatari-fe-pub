import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { EpisodeDetailSection } from './EpisodeDetailSection'

const meta = {
  title: 'Features/Episode/EpisodeDetailSection',
  component: EpisodeDetailSection,
  parameters: { layout: 'padded' },
  args: {
    title: '',
    summary: '',
    content: '',
    onTitleChange: () => {},
    onSummaryChange: () => {},
    onContentChange: () => {},
  },
} satisfies Meta<typeof EpisodeDetailSection>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    return (
      <EpisodeDetailSection
        title={title}
        summary={summary}
        content={content}
        onTitleChange={setTitle}
        onSummaryChange={setSummary}
        onContentChange={setContent}
      />
    )
  },
}

export const Prefilled: Story = {
  render: () => {
    const [title, setTitle] = useState('信長SNSデビュー')
    const [summary, setSummary] = useState('SNSの誹謗中傷に悩む胡蝶の姿を見て、ふと自分がスマホを操作して、人間として胡蝶をバッシングする者をSNS上で成敗してやろうと思い立つ。')
    const [content, setContent] = useState('')
    return (
      <EpisodeDetailSection
        title={title}
        summary={summary}
        content={content}
        onTitleChange={setTitle}
        onSummaryChange={setSummary}
        onContentChange={setContent}
      />
    )
  },
}
