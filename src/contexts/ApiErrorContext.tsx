import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'

import { Button } from '../components/ui'
import { ApiError } from '../lib/apiClient'

export class DetailedError extends Error {
  readonly detail: string
  readonly status: number

  constructor(message: string, detail: string, status = 0) {
    super(message)
    this.name = 'DetailedError'
    this.detail = detail
    this.status = status
  }
}

interface ApiErrorInfo {
  status: number
  message: string
  detail?: string
}

interface ContextValue {
  showError: (e: unknown) => void
}

const ApiErrorContext = createContext<ContextValue>({ showError: () => {} })

export function ApiErrorProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<ApiErrorInfo | null>(null)

  const showError = useCallback((e: unknown) => {
    if (e instanceof DetailedError) {
      setInfo({ status: e.status, message: e.message, detail: e.detail })
    } else if (e instanceof ApiError) {
      setInfo({ status: e.status, message: e.message })
    } else if (e instanceof Error) {
      setInfo({ status: 0, message: e.message })
    } else {
      setInfo({ status: 0, message: '不明なエラーが発生しました' })
    }
  }, [])

  return (
    <ApiErrorContext.Provider value={{ showError }}>
      {children}
      {info && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-red-500 px-5 py-4 flex items-center gap-3">
              <span className="text-white font-bold text-[15px]">エラーが発生しました</span>
              {info.status > 0 && (
                <span className="ml-auto font-mono font-bold text-[12px] bg-red-700 text-red-100 px-2.5 py-0.5 rounded-full">
                  {info.status}
                </span>
              )}
            </div>
            <div className="px-5 py-5 flex flex-col gap-3">
              <p className="text-[14px] text-gray-700 leading-relaxed break-words">
                {info.message}
              </p>
              {info.detail && (
                <details className="text-[12px]">
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-600 select-none">
                    詳細を表示
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-500 whitespace-pre-wrap break-all leading-relaxed overflow-auto max-h-48">
                    {info.detail}
                  </pre>
                </details>
              )}
            </div>
            <div className="px-5 pb-5 flex justify-end">
              <Button onClick={() => setInfo(null)}>閉じる</Button>
            </div>
          </div>
        </div>
      )}
    </ApiErrorContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApiError() {
  return useContext(ApiErrorContext)
}
