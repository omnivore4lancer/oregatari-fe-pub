import { Link } from 'react-router-dom'
import { PlusIcon } from '../../../../components/Icons'

export function NewStoryCard() {
  return (
    <Link
      to="/stories/new"
      className="no-underline group"
      style={{ width: 160 }}
    >
      <div
        className="w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-400 transition-colors"
        style={{ height: 200 }}
      >
        <PlusIcon size={28} />
        <span className="text-[12px] font-semibold">新しい作品を登録</span>
      </div>
    </Link>
  )
}
