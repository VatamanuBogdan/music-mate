import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    pageSize: number;
    pageCount: number;
}

export interface PaginationParam {
    page: number;
    size: number;
}

export type PaginatedPromise<T> = Promise<PaginatedResponse<T>>;

export type PaginatedQueryResult<T> = UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>>;
