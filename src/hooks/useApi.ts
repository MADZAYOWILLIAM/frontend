import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { DependencyList } from 'react';

/**
 * A reusable hook to handle asynchronous data fetching from API fetchers.
 * Provides state for data, loading, and error handling.
 */
export function useApi<T, P = void>(
  fetcher: (params: P) => Promise<T>,
  deps: DependencyList = [],
  params?: P
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async (manualParams?: P) => {
    if (!isMounted.current) return;
    setIsLoading(true);
    try {
      const effectiveParams = manualParams !== undefined ? manualParams : (params as P);
      const result = await fetcher(effectiveParams);
      if (isMounted.current) {
        setData(result);
        setError(null);
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, params]);

  const depsKey = useMemo(() => JSON.stringify(deps), [deps]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchData());
  }, [fetchData, depsKey]);

  return { data, isLoading, error, refetch: fetchData };
}

export interface MutationOptions<T> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
}

/**
 * A hook to handle manual mutations (POST, PUT, DELETE).
 */
export function useMutation<T, Args extends unknown[]>(
  mutationFn: (...args: Args) => Promise<T>,
  options?: MutationOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const optionsRef = useRef(options);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const mutate = useCallback(async (...args: Args): Promise<T> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      const result = await mutationFn(...args);
      if (isMounted.current) {
        setData(result);
        setIsSuccess(true);
        await optionsRef.current?.onSuccess?.(result);
      }
      return result;
    } catch (err: unknown) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Action failed');
        optionsRef.current?.onError?.(err);
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [mutationFn]);

  return { mutate, data, isLoading, isSuccess, error };
}
