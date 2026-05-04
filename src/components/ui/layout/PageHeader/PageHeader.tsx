import { ArrowLeftIcon } from '../../../Icons'

interface PageHeaderProps {
  title: string
  description?: string
  titleExtra?: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
}

export function PageHeader({ title, description, titleExtra, onBack, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 p-1 rounded text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeftIcon size={16} />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold text-[var(--text-h)] m-0 leading-tight">
              {title}
            </h1>
            {titleExtra}
          </div>
          {description && <p className="text-[13px] text-[var(--text)] mt-1 m-0">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
