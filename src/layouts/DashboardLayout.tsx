import { Link, Outlet, useNavigate } from 'react-router-dom'
import { BookIcon, BellIcon, LogOutIcon } from '../components/Icons'
import { useAuth } from '../contexts/AuthContext'

function TopNav() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="h-11 flex items-center px-4 bg-white border-b border-gray-200 shrink-0">
      {/* Logo → home */}
      <Link to="/dashboard" className="flex items-center gap-1.5 shrink-0 no-underline">
        <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center">
          <span className="text-white"><BookIcon size={14} /></span>
        </div>
      </Link>

      <div className="flex-1" />

      {/* Right side */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent border-none cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <BellIcon size={15} />
      </button>
      <button
        onClick={handleSignOut}
        className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent border-none cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors ml-1"
        title="ログアウト"
      >
        <LogOutIcon size={15} />
      </button>
    </header>
  )
}

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <TopNav />
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  )
}
