import { useEffect, useState } from 'react'

function resolveInitialValue<T>(initialValue: T | (() => T)) {
  return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
}

function readStoredValue<T>(key: string, initialValue: T | (() => T)) {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? (JSON.parse(storedValue) as T) : resolveInitialValue(initialValue)
  } catch {
    return resolveInitialValue(initialValue)
  }
}

export function usePersistentState<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue))

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
