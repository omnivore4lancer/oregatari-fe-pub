import { PagePreview } from '../../../episode'
import type { ViewerPage } from '../../types'

function CoverPageDisplay({
  episodeTitle,
  coverImageUrl,
}: {
  episodeNumber: number
  episodeTitle: string
  coverImageUrl: string | null
}) {
  if (coverImageUrl) {
    return (
      <img
        src={coverImageUrl}
        alt={episodeTitle}
        className="w-full h-full object-cover"
      />
    )
  }
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-white/30 text-[13px]">カバー画像なし</p>
    </div>
  )
}

function TitlePageDisplay({ episodeNumber, episodeTitle }: { episodeNumber: number; episodeTitle: string }) {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-4 px-10 select-none">
      <p
        className="text-gray-300 font-medium tracking-widest"
        style={{ fontSize: 'clamp(10px, 1.5vh, 13px)' }}
      >
        第{episodeNumber}話
      </p>
      <p
        className="text-gray-900 font-bold text-center leading-snug"
        style={{ fontSize: 'clamp(18px, 3.5vh, 28px)', writingMode: 'vertical-rl' }}
      >
        {episodeTitle}
      </p>
    </div>
  )
}

function PageDisplay({ page }: { page: ViewerPage }) {
  if (page.type === 'cover') {
    return <CoverPageDisplay episodeNumber={page.episodeNumber} episodeTitle={page.episodeTitle} coverImageUrl={page.coverImageUrl} />
  }
  if (page.type === 'title') {
    return <TitlePageDisplay episodeNumber={page.episodeNumber} episodeTitle={page.episodeTitle} />
  }
  if (page.data.imageUrl) {
    return (
      <img
        src={page.data.imageUrl}
        alt={`ページ ${page.data.pageNumber}`}
        className="w-full h-full object-contain"
      />
    )
  }
  return (
    <div className="w-full h-full bg-white">
      <PagePreview page={page.data} />
    </div>
  )
}

interface NavArrowProps {
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
  label: string
}

function NavArrow({ direction, disabled, onClick, label }: NavArrowProps) {
  const points = direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-0 h-full w-12 md:w-16 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 active:bg-white/10 transition-all z-10 disabled:opacity-0 border-0 bg-transparent cursor-pointer`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={points} />
      </svg>
    </button>
  )
}

interface MangaSpreadProps {
  rightPage: ViewerPage | null
  leftPage: ViewerPage | null
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  isMobile: boolean
  loading: boolean
}

export function MangaSpread({
  rightPage,
  leftPage,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  isMobile,
  loading,
}: MangaSpreadProps) {
  const padding = isMobile ? 'py-4 px-12' : 'py-6 px-20'

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      <NavArrow direction="left" disabled={!canGoNext} onClick={onNext} label="次のページへ" />

      <div className={`flex h-full items-center justify-center ${padding} gap-0`}>
        {loading ? (
          <div className="text-white/30 text-sm">読み込み中...</div>
        ) : (
          <>
            {leftPage && (
              <div className="h-full aspect-[2/3] shadow-[0_8px_40px_rgba(0,0,0,0.8)]">
                <PageDisplay page={leftPage} />
              </div>
            )}
            {rightPage && (
              <div className={`h-full aspect-[2/3] shadow-[0_8px_40px_rgba(0,0,0,0.8)] ${!leftPage ? 'mx-auto' : ''}`}>
                <PageDisplay page={rightPage} />
              </div>
            )}
          </>
        )}
      </div>

      <NavArrow direction="right" disabled={!canGoPrev} onClick={onPrev} label="前のページへ" />
    </div>
  )
}
