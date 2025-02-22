import { Paginated } from 'api/pagination';
import { VirtualizedListItems } from 'components/containers/VirtualizedList';
import { useMemo } from 'react';
import { VirtualizedListPaginatedItems } from 'utils/adapters';
import { FixedPagesFlattener } from 'utils/page-flattener';

export default function useVirtualizedListItems<T>(
    pages: Paginated<T>[] | undefined,
    pageSize: number
): VirtualizedListItems<T> {
    return useMemo(() => {
        const flattener = new FixedPagesFlattener(pages ?? [], pageSize);
        return new VirtualizedListPaginatedItems(flattener);
    }, [pages, pageSize]);
}
