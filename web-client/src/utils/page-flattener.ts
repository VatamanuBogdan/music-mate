import { Paginated } from 'api/pagination';

import { getBuildType } from './helpers';
import { RangeIndex } from './types';

interface PagesFlattener<T> {
    flattenRange(range: RangeIndex): Iterable<T>;
}

class FixedPagesFlattener<T> implements PagesFlattener<T> {
    private pages: Paginated<T>[];
    private pageSize: number;

    public constructor(pages: Paginated<T>[], pageSize: number) {
        this.pages = pages;
        this.pageSize = pageSize;

        if (getBuildType() === 'developement') {
            FixedPagesFlattener.assertPagesFormat(pages, pageSize);
        }
    }

    public flattenRange(range: RangeIndex): FlattenedPagesIterable<T> {
        const { startIndex, endIndex } = this.boundRange(range);

        if (startIndex > endIndex) {
            return new FlattenedPagesIterable(null);
        }

        return new FlattenedPagesIterable({
            pages: this.pages,
            range: {
                firstPageIndex: Math.floor(startIndex / this.pageSize),
                firstPageStartIndex: startIndex % this.pageSize,
                lastPageIndex: Math.floor(endIndex / this.pageSize),
                lastPageEndIndex: endIndex % this.pageSize,
            },
        });
    }

    private boundRange({ startIndex, endIndex }: RangeIndex): RangeIndex {
        if (this.pages.length === 0 || this.pageSize <= 0) {
            return { startIndex: 0, endIndex: -1 };
        }

        const lastPageIndex = this.pages.length - 1;
        const lastPageLength = this.pages[lastPageIndex].content.length;

        return {
            startIndex,
            endIndex: Math.min(endIndex, lastPageIndex * this.pageSize + lastPageLength - 1),
        };
    }

    private static assertPagesFormat<T>(pages: Paginated<T>[], pageSize: number) {
        pages.forEach((p, index) => {
            if (p.content.length !== pageSize && index < pages.length - 1) {
                throw new Error(
                    `Incorect page format, only the last page should have a value lesser than ${pageSize} fixed page size`
                );
            }
        });
    }
}

type FlattenedPagesRange = {
    firstPageIndex: number;
    firstPageStartIndex: number;
    lastPageIndex: number;
    lastPageEndIndex: number;
};

class FlattenedPagesIterable<T> implements Iterable<T> {
    private pages?: Paginated<T>[];
    private range?: FlattenedPagesRange;

    constructor(args: { pages: Paginated<T>[]; range: FlattenedPagesRange } | null) {
        if (args) {
            this.pages = args.pages;
            this.range = args.range;
        }
    }

    [Symbol.iterator](): Iterator<T> {
        if (this.pages && this.range) {
            return new FlattenedPagesIterator(this.pages, this.range);
        } else {
            return {
                next(): IteratorResult<T, undefined> {
                    return { done: true, value: undefined };
                },
            };
        }
    }
}

class FlattenedPagesIterator<T> implements Iterator<T> {
    private pages: Paginated<T>[];

    private currentPageIndex: number;
    private currentElementIndex: number;
    private lastPageIndex: number;
    private lastPageEndINdex: number;

    public constructor(pages: Paginated<T>[], range: FlattenedPagesRange) {
        this.pages = pages;

        this.currentPageIndex = range.firstPageIndex;
        this.currentElementIndex = range.firstPageStartIndex;
        this.lastPageIndex = range.lastPageIndex;
        this.lastPageEndINdex = range.lastPageEndIndex;
    }

    public next(): IteratorResult<T, undefined> {
        if (this.isIterationDone()) {
            return {
                done: true,
                value: undefined,
            };
        }

        const value = this.pages[this.currentPageIndex].content[this.currentElementIndex];
        if (this.currentElementIndex < this.pages[this.currentPageIndex].pageSize - 1) {
            this.currentElementIndex += 1;
        } else {
            this.currentElementIndex = 0;
            this.currentPageIndex += 1;
        }

        return {
            done: false,
            value,
        };
    }

    private isIterationDone(): boolean {
        if (this.currentPageIndex > this.lastPageIndex) {
            return true;
        }

        return (
            this.currentPageIndex === this.lastPageIndex &&
            this.currentElementIndex > this.lastPageEndINdex
        );
    }
}

export type { PagesFlattener };
export { FixedPagesFlattener };
