import { Paginated } from 'api/pagination';
import { VirtualListItems } from 'components/containers/VirtualList';
import { useMemo } from 'react';
import { VirtualListFlattenedPages } from 'utils/adapters';
import { FlattenedVariablePages } from 'utils/flattened-pages';

export default function useVirtualListAdapter<T>(
    pages: Paginated<T>[] | undefined
): VirtualListItems<T> {
    return useMemo(() => {
        const flattener = new FlattenedVariablePages(pages ?? []);
        return new VirtualListFlattenedPages(flattener);
    }, [pages]);
}
