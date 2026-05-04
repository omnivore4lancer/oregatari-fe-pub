interface CharacterAvatarProps {
  initials: string
  color: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-[13px]',
  lg: 'w-12 h-12 text-[15px]',
}

const FALLBACK_COLOR = '#8b5cf6'

export function CharacterAvatar({
  initials,
  color,
  imageUrl,
  size = 'md',
  className = '',
}: CharacterAvatarProps) {
  if (imageUrl) {
    return (
      <div
        className={`shrink-0 rounded-full overflow-hidden select-none ${SIZE_CLASS[size]} ${className}`}
      >
        <img
          src={imageUrl}
          alt={initials}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  const bgColor = color.startsWith('#') || color.startsWith('rgb') ? color : FALLBACK_COLOR

  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold text-white select-none ${SIZE_CLASS[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  )
}
