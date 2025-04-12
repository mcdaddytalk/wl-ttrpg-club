import { useQueryState } from 'nuqs';

export function usePaginationQueryParams(defaultPage = 1, defaultPageSize = 5) {
  const [page, setPage] = useQueryState('page', {
    history: 'push',
    shallow: false,
    defaultValue: defaultPage,
    parse: Number,
    serialize: (v) => v.toString(),
  });

  const [pageSize, setPageSize] = useQueryState('pageSize', {
    history: 'push',
    shallow: false,
    defaultValue: defaultPageSize,
    parse: Number,
    serialize: (v) => v.toString(),
  });

  return {
    page: page ?? defaultPage,
    pageSize: pageSize ?? defaultPageSize,
    setPage,
    setPageSize,
  };
}
