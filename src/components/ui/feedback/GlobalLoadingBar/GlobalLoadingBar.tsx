import { useIsFetching } from '@tanstack/react-query'

export function GlobalLoadingBar() {
  const isFetching = useIsFetching()

  if (!isFetching) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent overflow-hidden">
      <div className="h-full bg-purple-500 animate-loading-bar" />
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
