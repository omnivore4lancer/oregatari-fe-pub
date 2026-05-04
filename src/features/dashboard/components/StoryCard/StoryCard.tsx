import { Link } from 'react-router-dom'
import { TrashIcon } from '../../../../components/Icons'
import type { StoryItem } from '../../types'

interface StoryCardProps {
  story: StoryItem
  onDelete: (story: StoryItem) => void
}

function ThumbnailGrid({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-[28px] font-bold text-gray-300 select-none">{title.slice(0, 1)}</span>
      </div>
    )
  }
  if (images.length === 1) {
    return <img src={images[0]} alt="" className="w-full h-full object-cover" />
  }
  const cells = images.slice(0, 4)
  return (
    <div className="w-full h-full grid grid-cols-2 gap-px bg-gray-200">
      {cells.map((url, i) => (
        <img key={i} src={url} alt="" className="w-full h-full object-cover" />
      ))}
    </div>
  )
}

export function StoryCard({ story, onDelete }: StoryCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden cursor-pointer" style={{ width: 160 }}>
      <Link to={`/stories/${story.id}/story`} className="no-underline block">
        <div className="w-full rounded-lg overflow-hidden bg-gray-100" style={{ height: 200 }}>
          {story.coverImageUrl ? (
            <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
          ) : (
            <ThumbnailGrid images={story.previewImages} title={story.title} />
          )}
        </div>
        <div className="pt-2 pb-1">
          <p className="text-[13px] font-semibold text-gray-800 m-0 truncate">{story.title}</p>
          <p className="text-[11px] text-gray-400 m-0 mt-0.5">{story.age}</p>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); onDelete(story) }}
        className="absolute top-2 right-2 w-6 h-6 rounded bg-black/40 text-white border-none flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <TrashIcon size={11} />
      </button>
    </div>
  )
}
