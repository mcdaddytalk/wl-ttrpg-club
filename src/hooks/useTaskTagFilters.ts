import { useQueryState } from 'nuqs';

export function useTaskTagFilters() {
  const [tags, setTags] = useQueryState('tags', {
    history: 'push',
    parse: (val) => val.split(',').filter(Boolean),
    serialize: (val) => val.join(','),
  });

  return { tags, setTags };
}
