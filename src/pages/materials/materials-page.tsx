import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { ChevronDownIcon, SearchIcon, SparkleIcon } from '../../components/Icons'
import { Button, EmptyState, SpinnerDots } from '../../components/ui'
import { useApiError } from '../../contexts/ApiErrorContext'
import { useToast } from '../../contexts/ToastContext'
import { GroupPanel, materialApi, materialGroupApi, MaterialCard } from '../../features/materials'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

export default function MaterialsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const storyId = Number(id)
  const { showError } = useApiError()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [activeGroup, setActiveGroup] = useState<string>('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const { data: groups = [], isLoading: groupsLoading } = useQueryWithError({
    queryKey: queryKeys.materialGroups(storyId),
    queryFn: () =>
      materialGroupApi.getGroups(storyId).then((list) =>
        list.map((g) => ({ id: String(g.id), label: g.name })),
      ),
  })

  useEffect(() => {
    if (groups.length > 0 && !activeGroup) setActiveGroup(groups[0].id)
  }, [groups, activeGroup])

  const { data: materials = [], isLoading: materialsLoading } = useQueryWithError({
    queryKey: [...queryKeys.materials(storyId), { groupId: Number(activeGroup), search, sort }],
    queryFn: () =>
      materialApi.getMaterials(storyId, {
        groupId: Number(activeGroup),
        search: search || undefined,
        sort,
      }),
    enabled: !!activeGroup,
  })

  async function handleAddGroup(name: string) {
    try {
      const group = await materialGroupApi.createGroup(storyId, { name })
      await queryClient.invalidateQueries({ queryKey: queryKeys.materialGroups(storyId) })
      setActiveGroup(String(group.id))
      showToast('グループを追加しました')
    } catch (e) {
      showError(e)
    }
  }

  const loading = groupsLoading || (!!activeGroup && materialsLoading)

  return (
    <div className="flex h-full">
      <GroupPanel
        groups={groups}
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
        onAddGroup={handleAddGroup}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text)] pointer-events-none">
              <SearchIcon size={13} />
            </span>
            <input
              className="w-full pl-7 pr-3 py-1.5 text-[13px] border border-[var(--border)] rounded-md bg-transparent outline-none focus:border-[var(--accent-border)] text-[var(--text-h)] placeholder:text-[var(--text)]"
              placeholder="素材を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[12px] border border-[var(--border)] px-2.5 py-1.5 rounded-md bg-transparent text-[var(--text-h)] cursor-pointer hover:border-[var(--accent-border)] transition-colors"
            onClick={() => setSort((s) => (s === 'desc' ? 'asc' : 'desc'))}
          >
            {sort === 'desc' ? '新しい順' : '古い順'} <ChevronDownIcon size={11} />
          </button>
          <Button
            variant="primary"
            className="flex items-center gap-1.5 text-[12px]"
            onClick={() => navigate(`/stories/${id}/materials/new`)}
          >
            <SparkleIcon size={12} />
            素材を生成
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex-1 flex justify-center pt-32">
              <SpinnerDots size="md" />
            </div>
          ) : materials.length === 0 ? (
            <EmptyState message="素材がありません。「素材を生成」から作成しましょう。" />
          ) : (
            <div className="flex flex-wrap gap-3">
              {materials.map((m) => (
                <MaterialCard
                  key={m.id}
                  title={m.name}
                  date={m.createdAt.slice(0, 10).replace(/-/g, '/')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
