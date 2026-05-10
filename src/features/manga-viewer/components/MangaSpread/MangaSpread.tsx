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
  const src = page.data.displayImageUrl ?? page.data.imageUrl
  if (src) {
    return (
      <img
        src={src}
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
      className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-0 h-full w-12 md:w-16 hidden sm:flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 active:bg-white/10 transition-all z-10 disabled:opacity-0 border-0 bg-transparent cursor-pointer`}
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

function MobileNavBar({
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
}: {
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="sm:hidden flex items-center justify-between px-4 py-2 border-t border-white/8 bg-[#1a1a1a]">
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="次のページへ"
        className="flex items-center gap-2 px-5 py-2.5 text-white/60 hover:text-white/90 active:text-white disabled:opacity-0 bg-transparent border-0 cursor-pointer transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="text-[13px]">次へ</span>
      </button>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="前のページへ"
        className="flex items-center gap-2 px-5 py-2.5 text-white/60 hover:text-white/90 active:text-white disabled:opacity-0 bg-transparent border-0 cursor-pointer transition-colors"
      >
        <span className="text-[13px]">前へ</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
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
  const padding = isMobile ? 'py-4 px-4' : 'py-6 px-20'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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
      <MobileNavBar canGoNext={canGoNext} canGoPrev={canGoPrev} onNext={onNext} onPrev={onPrev} />
    </div>
  )
}
