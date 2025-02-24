import { VirtualListItems } from 'components/containers/VirtualList';

import { FlattenedPages } from './flattened-pages';
import { RangeIndex } from './types';

class VirtualListFlattenedPages<T> implements VirtualListItems<T> {
    private flattenedPages: FlattenedPages<T>;

    public constructor(flattenedPages: FlattenedPages<T>) {
        this.flattenedPages = flattenedPages;
    }

    public at(index: number): T {
        return this.flattenedPages.at(index);
    }

    public get length(): number {
        return this.flattenedPages.length;
    }

    public map<U>(range: RangeIndex, callback: (value: T, index: number) => U): U[] {
        const mappedValues = new Array<U>(range.endIndex - range.startIndex + 1);
        let index = 0;

        for (const value of this.flattenedPages.flattenRange(range)) {
            mappedValues[index] = callback(value, index);
            index += 1;
        }

        mappedValues.splice(index);

        return mappedValues;
    }
}

export { VirtualListFlattenedPages };
