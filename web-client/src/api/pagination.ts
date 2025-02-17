import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

export interface Paginated<T> {
    content: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    totalSize: number;
}

export interface PaginationParam {
    page: number;
    size: number;
}

export type PaginatedPromise<T> = Promise<Paginated<T>>;

export type PaginatedQueryResult<T> = UseInfiniteQueryResult<InfiniteData<Paginated<T>>>;
