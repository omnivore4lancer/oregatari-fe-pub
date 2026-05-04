import { useEffect } from 'react'
import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query'

import { useApiError } from '../contexts/ApiErrorContext'

export function useQueryWithError<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const { showError } = useApiError()
  const result = useQuery(options)
  useEffect(() => {
    if (result.error) showError(result.error)
  }, [result.error, showError])
  return result
}
