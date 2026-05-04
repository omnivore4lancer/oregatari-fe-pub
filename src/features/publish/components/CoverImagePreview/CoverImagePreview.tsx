import React from 'react'
import { SpinnerDots } from '../../../../components/ui'
import { SectionCard } from '../../../../components/ui'

interface Props {
  isGenerating: boolean
  imageUrl: string | null
  headerActions?: React.ReactNode
}

export function CoverImagePreview({ isGenerating, imageUrl, headerActions }: Props) {
  return (
    <SectionCard title="表紙画像" headerActions={headerActions}>
      <div className="mb-4" />
      <div className="w-full aspect-[3/4] rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-2">
            <SpinnerDots size="md" />
            <p className="text-[12px] text-[var(--text)] text-center m-0">生成中...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="カバー画像" className="w-full h-full object-cover" />
        ) : (
          <p className="text-[12px] text-[var(--text)] text-center px-4">
            生成後に<br />表示されます
          </p>
        )}
      </div>
    </SectionCard>
  )
}
