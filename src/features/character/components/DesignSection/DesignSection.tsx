import { ImageIcon, SparkleIcon } from '../../../../components/Icons'
import { EmptyState, SectionHeader, SpinnerDots } from '../../../../components/ui'
import type { CharacterDetail } from '../../types'

interface DesignSectionProps {
  character: CharacterDetail
  isGenerating?: boolean
  onGenerate?: () => void
}

export function DesignSection({ character, isGenerating, onGenerate }: DesignSectionProps) {
  return (
    <section className="mb-6">
      <SectionHeader
        icon={<span className="text-[15px]">🎨</span>}
        title="キャラクターデザイン"
        extra={
          <span className="text-[11px] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5">
            #デフォルト
          </span>
        }
      />

      <div className="border border-dashed border-[var(--border)] rounded-lg mb-4 bg-[var(--bg)] overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <SpinnerDots size="md" />
            <p className="text-[13px] text-[var(--text)]">三面図を生成中...</p>
          </div>
        ) : character.imageUrl ? (
          <img
            src={character.imageUrl}
            alt={`${character.name} 三面図`}
            className="w-full object-contain"
          />
        ) : (
          <EmptyState icon={<ImageIcon size={40} />} message="三面図が設定されていません" />
        )}
      </div>

      {!isGenerating && onGenerate && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onGenerate}
            className="flex items-center gap-1.5 text-[12px] text-[var(--accent)] bg-[var(--accent-bg)] border border-[var(--accent-border)] px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
          >
            <SparkleIcon size={12} />
            {character.imageUrl ? '三面図を再生成' : '三面図を生成'}
          </button>
        </div>
      )}

      <p className="text-[13px] text-[var(--text)] leading-relaxed mb-4">{character.appearance}</p>

      <div>
        <p className="text-[12px] font-semibold text-[var(--text-h)] mb-2">着装バリエーション</p>
        <button
          type="button"
          className="flex items-center gap-1 text-[12px] text-[var(--accent)] bg-[var(--accent-bg)] border border-[var(--accent-border)] px-2.5 py-1 rounded-full cursor-pointer"
        >
          ● デフォルト
        </button>
      </div>
    </section>
  )
}
