interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'secondary', className = '', children, ...props }: ButtonProps) {
  const variants = {
    primary:
      'font-semibold border-none text-white bg-gradient-to-br from-purple-400 via-purple-500 to-violet-700 shadow-[0_4px_12px_rgba(168,85,247,0.4)]',
    secondary: 'border border-[var(--border)] bg-transparent text-[var(--text)]',
  }
  return (
    <button
      type="button"
      className={`px-4 py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
