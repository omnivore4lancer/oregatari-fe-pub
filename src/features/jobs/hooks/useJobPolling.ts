import { useEffect, useRef, useState } from 'react'

const DEFAULT_INTERVAL_MS = 3000

interface UseJobPollingOptions<T> {
  poll: () => Promise<T>
  isDone: (result: T) => boolean
  onDone: (result: T) => void
  onError: (e: unknown) => void
  intervalMs?: number
}

export function useJobPolling<T>({ poll, isDone, onDone, onError, intervalMs }: UseJobPollingOptions<T>) {
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }

  function start() {
    if (intervalRef.current) return
    setIsPolling(true)
    intervalRef.current = setInterval(async () => {
      try {
        const result = await poll()
        if (isDone(result)) {
          stop()
          onDone(result)
        }
      } catch (e) {
        stop()
        onError(e)
      }
    }, intervalMs ?? DEFAULT_INTERVAL_MS)
  }

  useEffect(() => () => stop(), [])

  return { isPolling, start, stop }
}
