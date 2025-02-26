import { Paginated } from 'api/pagination';

import { binarySearch, getBuildType } from './helpers';
import { RangeIndex } from './types';

interface FlattenedPages<T> {
    readonly length: number;
    at(index: number): T;
    flattenRange(range: RangeIndex): Iterable<T>;
}

type PageIndexes = { pageIndex: number; inPageIndex: number };

abstract class FlattenedPagesBase<T> implements FlattenedPages<T> {
    protected pages: Paginated<T>[];
    public readonly length: number;

    public constructor(pages: Paginated<T>[], length: number) {
        this.pages = pages;
        this.length = length;
    }

    protected abstract getPageIndexes(index: number): PageIndexes;

    public at(index: number): T {
        const { pageIndex, inPageIndex } = this.getPageIndexes(index);
        return this.pages[pageIndex].content[inPageIndex];
    }

    public flattenRange(range: RangeIndex): Iterable<T> {
        if (this.length === 0) {
            return new FlattenedPagesIterable(null);
        }

        const startIndex = range.startIndex;
        const endIndex = Math.min(range.endIndex, this.length - 1);

        return new FlattenedPagesIterable({
            pages: this.pages,
            firstPageIndexes: this.getPageIndexes(startIndex),
            lastPageIndexes: this.getPageIndexes(endIndex),
        });
    }
}

class FlattenedVariablePages<T> extends FlattenedPagesBase<T> {
    private pageIndexes: number[];

    public constructor(pages: Paginated<T>[]) {
        const filteredPages = pages.filter((p) => p.content.length > 0);

        let sum = -1;
        const pageIndexes = filteredPages.map((v) => {
            sum += v.content.length;
            return sum;
        });

        super(filteredPages, sum + 1);
        this.pageIndexes = pageIndexes;
    }

    protected getPageIndexes(index: number): PageIndexes {
        const pageIndex = binarySearch(this.pageIndexes, index);
        let inPageIndex = index;
        if (pageIndex > 0) {
            inPageIndex -= this.pageIndexes[pageIndex - 1] + 1;
        }

        return { pageIndex, inPageIndex };
    }
}

class FlattenedFixedPages<T> extends FlattenedPagesBase<T> {
    private pageLength: number;

    public constructor(pages: Paginated<T>[], pageLength: number) {
        if (getBuildType() === 'developement') {
            FlattenedFixedPages.assertPagesFormat(pages, pageLength);
        }

        let length: number;
        if (pages.length > 0 && pageLength > 0) {
            const lastPageIndex = pages.length - 1;
            const lastPageLength = pages[lastPageIndex].content.length;

            length = lastPageIndex * pageLength + lastPageLength;
        } else {
            length = 0;
        }

        super(pages, length);
        this.pageLength = pageLength;
    }

    protected getPageIndexes(index: number): PageIndexes {
        return {
            pageIndex: Math.floor(index / this.pageLength),
            inPageIndex: index % this.pageLength,
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

class FlattenedPagesIterable<T> implements Iterable<T> {
    private pages?: Paginated<T>[];
    private firstPageIndexes?: PageIndexes;
    private lastPageIndexes?: PageIndexes;

    constructor(
        args: {
            pages: Paginated<T>[];
            firstPageIndexes: PageIndexes;
            lastPageIndexes: PageIndexes;
        } | null
    ) {
        if (args) {
            this.pages = args.pages;
            this.firstPageIndexes = args.firstPageIndexes;
            this.lastPageIndexes = args.lastPageIndexes;
        }
    }

    [Symbol.iterator](): Iterator<T> {
        if (this.pages && this.firstPageIndexes && this.lastPageIndexes) {
            return new FlattenedPagesIterator(
                this.pages,
                this.firstPageIndexes,
                this.lastPageIndexes
            );
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
    private currentInPageIndex: number;
    private lastPageIndex: number;
    private lastInPageIndex: number;

    public constructor(
        pages: Paginated<T>[],
        firstPageIndexes: PageIndexes,
        lastPageIndexes: PageIndexes
    ) {
        this.pages = pages;

        this.currentPageIndex = firstPageIndexes.pageIndex;
        this.currentInPageIndex = firstPageIndexes.inPageIndex;
        this.lastPageIndex = lastPageIndexes.pageIndex;
        this.lastInPageIndex = lastPageIndexes.inPageIndex;
    }

    public next(): IteratorResult<T, undefined> {
        if (this.isIterationDone()) {
            return {
                done: true,
                value: undefined,
            };
        }

        const value = this.pages[this.currentPageIndex].content[this.currentInPageIndex];
        if (this.currentInPageIndex < this.pages[this.currentPageIndex].content.length - 1) {
            this.currentInPageIndex += 1;
        } else {
            this.currentInPageIndex = 0;
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
            this.currentInPageIndex > this.lastInPageIndex
        );
    }
}

export type { FlattenedPages };
export { FlattenedVariablePages, FlattenedFixedPages };
