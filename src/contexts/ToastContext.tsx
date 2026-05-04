import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'

interface Toast {
  id: number
  message: string
}

interface ContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ContextValue>({ showToast: () => {} })

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string) => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 bg-gray-900 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg animate-fade-in"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
