import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T, 
  delay: number = 500,
  callback?: (debounced: T) => void
): [T, (val: T) => void] {
  const [immediateValue, setImmediateValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      callback?.(immediateValue)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [immediateValue, delay, callback])

  return [immediateValue, setImmediateValue]
}