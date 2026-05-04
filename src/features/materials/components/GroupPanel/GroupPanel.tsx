import { useState } from 'react'

import { FolderIcon, PlusIcon } from '../../../../components/Icons'

export interface GroupItem {
  id: string
  label: string
}

interface GroupPanelProps {
  groups: GroupItem[]
  activeGroup: string
  onSelectGroup: (id: string) => void
  onAddGroup?: (name: string) => void
}

function AddGroupModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState('')

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[480px] mx-4 p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-[var(--text-h)]">新しいグループを作成</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <label className="block text-[13px] font-medium text-[var(--text-h)] mb-2">
          グループ名
        </label>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="グループ名を入力"
          className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-[13px] text-[var(--text-h)] outline-none focus:border-[var(--accent)] placeholder:text-gray-300 transition-colors"
        />

        <div className="flex justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-5 py-2 text-[13px] font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            作成
          </button>
        </div>
      </div>
    </div>
  )
}

export function GroupPanel({ groups, activeGroup, onSelectGroup, onAddGroup }: GroupPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)

  function handleAdd(name: string) {
    onAddGroup?.(name)
  }

  return (
    <>
      <div className="w-48 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] flex flex-col">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)]">
          <span className="text-[13px] font-semibold text-[var(--text-h)]">グループ</span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-5 h-5 flex items-center justify-center text-[var(--text)] hover:text-[var(--text-h)] cursor-pointer bg-transparent border-none"
          >
            <PlusIcon size={12} />
          </button>
        </div>
        <div className="flex flex-col py-1">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelectGroup(g.id)}
              className={`flex items-center gap-2 px-3 py-2 text-[13px] text-left w-full border-none cursor-pointer transition-colors ${
                activeGroup === g.id
                  ? 'bg-[var(--accent-bg)] text-[var(--accent)] font-semibold'
                  : 'bg-transparent text-[var(--text-h)] hover:bg-gray-50'
              }`}
            >
              <FolderIcon size={13} />
              <span className="truncate">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {modalOpen && <AddGroupModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} />}
    </>
  )
}
