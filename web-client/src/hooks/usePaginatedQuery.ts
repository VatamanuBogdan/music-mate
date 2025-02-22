import { useInfiniteQuery } from '@tanstack/react-query';
import { Paginated, PaginationParam } from 'api/pagination';

type PaginatedQueryFn<T> = (params: PaginationParam) => Promise<Paginated<T>>;

export interface PaginatedQueryResult<T> {
    pages: Paginated<T>[] | undefined;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

export default function usePaginatedQuery<T>(args: {
    queryKey: unknown[];
    queryFn: PaginatedQueryFn<T>;
    pageSize: number;
    enabled?: boolean;
}): PaginatedQueryResult<T> {
    const query = useInfiniteQuery({
        queryKey: [...args.queryKey, args.pageSize],
        queryFn: ({ pageParam }) => {
            return args.queryFn(pageParam);
        },
        initialPageParam: { page: 0, size: args.pageSize },
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.pageCount - 1) {
                return null;
            }

            return { page: lastPage.page + 1, size: args.pageSize };
        },
        enabled: args.enabled ?? true,
    });

    return {
        pages: query.data?.pages,
        fetchNextPage: query.fetchNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
}
