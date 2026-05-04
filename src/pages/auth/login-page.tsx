import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button, inputClass } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const errorMessage = await signIn(email, password)
    setSubmitting(false)
    if (errorMessage) {
      setError(errorMessage)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8">
        <h1 className="text-xl font-bold text-[var(--text-h)] mb-6">ログイン</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-h)] mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-h)] mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting} className="w-full mt-2">
            {submitting ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>
      </div>
    </div>
  )
}
