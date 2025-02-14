import { ApiError } from './errors';

export type ApiStatus = 'success' | 'error';

interface ApiResponseBase {
    status: ApiStatus;
    statusCode: number;
}

export interface ApiSuccessResponse<D> extends ApiResponseBase {
    status: 'success';
    data: D;
}

export interface ApiErrorResponse extends ApiResponseBase {
    status: 'error';
    error: ApiError;
}

export type ApiResponse<D> = ApiSuccessResponse<D> | ApiErrorResponse;

export type ApiResponsePromise<D> = Promise<ApiResponse<D>>;
export type ApiSuccessResponsePromise<D> = Promise<ApiSuccessResponse<D>>;
export type ApiErrorResponsePromise = Promise<ApiErrorResponse>;