import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SpinnerDots, StatusBadge } from '../../components/ui'
import { jobApi } from '../../features/jobs'
import type { JobStatus, JobType } from '../../features/jobs'
import { queryKeys } from '../../lib/queryKeys'
import { useQueryWithError } from '../../lib/useQueryWithError'

const JOB_TYPE_LABEL: Record<JobType, string> = {
  IMAGE_GENERATION: '画像生成',
  PANEL_LAYOUT: 'コマ割り',
  COVER_IMAGE: '表紙画像',
  THREE_VIEW: '三面図',
}

const STATUS_LABEL: Record<JobStatus, string> = {
  RUNNING: '実行中',
  DONE: '完了',
  FAILED: '失敗',
}

const STATUS_VARIANT: Record<JobStatus, 'accent' | 'success' | 'warning'> = {
  RUNNING: 'accent',
  DONE: 'success',
  FAILED: 'warning',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'たった今'
  if (mins < 60) return `${mins}分前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}時間前`
  return `${Math.floor(hours / 24)}日前`
}

const PAGE_SIZE = 50

export default function JobsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('')
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | ''>('')

  const { data, isLoading } = useQueryWithError({
    queryKey: queryKeys.jobs({ page, status: statusFilter || undefined, jobType: jobTypeFilter || undefined }),
    queryFn: () =>
      jobApi.getJobs({
        page,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
        jobType: jobTypeFilter || undefined,
      }),
  })

  const jobs = data?.jobs ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[18px] font-bold text-[var(--text-h)]">ジョブ一覧</h1>
        <span className="text-[13px] text-[var(--text)]">全 {total} 件</span>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          className="text-[13px] border border-[var(--border)] rounded-lg px-3 py-1.5 bg-white text-[var(--text)]"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as JobStatus | ''); setPage(1) }}
        >
          <option value="">すべてのステータス</option>
          <option value="RUNNING">実行中</option>
          <option value="DONE">完了</option>
          <option value="FAILED">失敗</option>
        </select>
        <select
          className="text-[13px] border border-[var(--border)] rounded-lg px-3 py-1.5 bg-white text-[var(--text)]"
          value={jobTypeFilter}
          onChange={(e) => { setJobTypeFilter(e.target.value as JobType | ''); setPage(1) }}
        >
          <option value="">すべての種別</option>
          <option value="IMAGE_GENERATION">画像生成</option>
          <option value="PANEL_LAYOUT">コマ割り</option>
          <option value="COVER_IMAGE">表紙画像</option>
          <option value="THREE_VIEW">三面図</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <SpinnerDots size="md" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-[var(--text)] text-[14px]">ジョブがありません</div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-32">日時</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">物語 / エピソード</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-20">ページ</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-24">種別</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-20">状態</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">モデル</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">エラー</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-[var(--text)] whitespace-nowrap">
                      {relativeTime(job.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {job.episode ? (
                        <>
                          <Link
                            to={`/stories/${job.episode.story.id}/episodes/${job.episode.id}/scenes`}
                            className="font-medium text-[var(--text-h)] hover:text-[var(--accent)] no-underline"
                          >
                            {job.episode.story.name}
                          </Link>
                          <div className="text-[12px] text-[var(--text)] mt-0.5">
                            #{job.episode.number} {job.episode.title}
                          </div>
                        </>
                      ) : job.storyId ? (
                        <Link
                          to={`/stories/${job.storyId}/publish`}
                          className="font-medium text-[var(--text-h)] hover:text-[var(--accent)] no-underline"
                        >
                          ストーリー #{job.storyId}
                        </Link>
                      ) : (
                        <span className="text-[var(--text)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--text)]">
                      {job.pageNumber != null ? `p.${job.pageNumber}` : '全ページ'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={JOB_TYPE_LABEL[job.jobType]} variant="neutral" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={STATUS_LABEL[job.status]} variant={STATUS_VARIANT[job.status]} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--text)]">
                      {job.imageModel ? (
                        <div>
                          <div>{job.usedModel ?? '—'}</div>
                          <div className="text-[10px] text-gray-400">img: {job.imageModel}</div>
                        </div>
                      ) : (
                        job.usedModel ?? '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-red-500 max-w-[240px] break-all whitespace-pre-wrap">
                      {job.errorMessage ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-[13px] border border-[var(--border)] rounded-lg disabled:opacity-40 bg-white"
              >
                前へ
              </button>
              <span className="text-[13px] text-[var(--text)]">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-[13px] border border-[var(--border)] rounded-lg disabled:opacity-40 bg-white"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
