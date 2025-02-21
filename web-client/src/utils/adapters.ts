import { VirtualizedListItems } from 'components/containers/VirtualizedList';

import { PagesFlattener } from './page-flattener';
import { RangeIndex } from './types';

class VirtualizedListPaginatedItems<T> implements VirtualizedListItems<T> {
    private flattener: PagesFlattener<T>;

    public constructor(flattener: PagesFlattener<T>) {
        this.flattener = flattener;
    }

    public at(index: number): T {
        return this.flattener.at(index);
    }

    public map<U>(range: RangeIndex, callback: (value: T, index: number) => U): U[] {
        const mappedValues = new Array<U>(range.endIndex - range.startIndex + 1);
        let index = 0;

        for (const playlist of this.flattener.flattenRange(range)) {
            mappedValues[index] = callback(playlist, index);
            index += 1;
        }

        mappedValues.splice(index);

        return mappedValues;
    }
}

export { VirtualizedListPaginatedItems };
