import { MultiSelectOption } from "@/components/ui/form-multi-select";
import { useState, useEffect } from "react";

export function useAsyncOptions<T>(
    endpoint: string,
    mapItem: (item: T) => MultiSelectOption
) {
  const [options, setOptions] = useState<ReadonlyArray<MultiSelectOption>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as T[];
        if (!cancelled) setOptions(data.map(mapItem));
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint, mapItem]);

  return { options, loading, error };
}
