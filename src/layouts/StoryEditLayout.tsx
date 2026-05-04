import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { BookIcon, BellIcon } from '../components/Icons'
import { storyApi } from '../features/story'

type NavPattern = string | ((p: string) => boolean)
const HIDE_NAV_PATTERNS: NavPattern[] = [
  '/scenes',
  (p) => /\/episodes\/\d+\/edit$/.test(p),
]

// --- nav icons ---

function GearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function PersonGroupIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function FilmIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

// --- nav def ---

type NavItemDef = {
  label: string
  icon: React.ReactNode
  path: string
}

function useNavItems() {
  const { id } = useParams()
  const base = `/stories/${id}`
  const items: NavItemDef[] = [
    { label: '基本設定', icon: <GearIcon />, path: `${base}/story` },
    { label: '登場人物', icon: <PersonGroupIcon />, path: `${base}/characters` },
    { label: 'エピソード', icon: <FilmIcon />, path: `${base}/episodes` },
    { label: '公開設定', icon: <GlobeIcon />, path: `${base}/publish` },
  ]
  if (!import.meta.env.PROD) {
    items.push({ label: '素材', icon: <LayersIcon />, path: `${base}/materials` })
  }
  return items
}

// --- header ---

function StoryTopBar() {
  const { id } = useParams()
  const storyId = Number(id)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [storyName, setStoryName] = useState('')
  const navItems = useNavItems()
  const base = `/stories/${id}`

  useEffect(() => {
    storyApi.getStory(storyId).then((s) => setStoryName(s.name)).catch(() => {})
  }, [storyId])

  function isActive(item: NavItemDef) {
    if (item.label === '基本設定') {
      return pathname === `${base}/story` || pathname === `${base}/cast`
    }
    return pathname.startsWith(item.path)
  }

  return (
    <div className="shrink-0 bg-white border-b border-gray-200">
      {/* top row */}
      <div className="h-11 flex items-center px-4 gap-3">
        <Link to="/dashboard" className="flex items-center justify-center w-7 h-7 rounded-md bg-purple-600 shrink-0 no-underline">
          <span className="text-white"><BookIcon size={14} /></span>
        </Link>
        <span className="text-[14px] font-semibold text-[var(--text-h)] truncate max-w-[240px]">
          {storyName}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent border-none cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <BellIcon size={15} />
        </button>
        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-[12px] font-bold shrink-0">
          R
        </div>
      </div>

      {/* nav tabs row */}
      <div className="flex items-center px-2 gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-1.5 px-3 py-2 text-[13px] no-underline transition-colors border-b-2 ${
              isActive(item)
                ? 'border-purple-600 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// --- layout ---

export default function StoryEditLayout() {
  const { pathname } = useLocation()
  const hideNav = HIDE_NAV_PATTERNS.some((p) =>
    typeof p === 'string' ? pathname.endsWith(p) : p(pathname),
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden text-left">
      {!hideNav && <StoryTopBar />}
      <main className="flex-1 bg-[#f7f6f3] overflow-y-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
