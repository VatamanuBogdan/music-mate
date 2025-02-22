export interface Paginated<T> {
    content: T[];
    page: number;
    pageSize: number;
    pageCount: number;
    totalSize: number;
}

export function mapPaginatedContent<T, R>(
    paginated: Paginated<T>,
    callback: (arg: T) => R
): Paginated<R> {
    return {
        ...paginated,
        content: paginated.content.map(callback),
    };
}

export interface PaginationParam {
    page: number;
    size: number;
}

export type PaginatedPromise<T> = Promise<Paginated<T>>;
