import { Paginated } from 'api/pagination';
import { useMemo } from 'react';
import { FlattenedFixedPages, FlattenedPages, FlattenedVariablePages } from 'utils/flattened-pages';

export default function useFlattenedPages<T>(
    pages: Paginated<T>[] | undefined,
    pageSize?: number
): FlattenedPages<T> {
    return useMemo(() => {
        if (pageSize) {
            return new FlattenedFixedPages(pages ?? [], pageSize);
        } else {
            return new FlattenedVariablePages(pages ?? []);
        }
    }, [pages, pageSize]);
}
