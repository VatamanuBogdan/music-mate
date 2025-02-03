import { ApiError } from "./errors";

type ApiStatus = 'success' | 'error';

interface ApiResponseBase {
    status: ApiStatus,
    statusCode: number
}

export interface ApiSuccessResponse<D> extends ApiResponseBase {
    status: 'success',
    data: D
}

export interface ApiErrorResponse extends ApiResponseBase {
    status: 'error',
    error: ApiError
}

export type ApiResponse<D> = ApiSuccessResponse<D> | ApiErrorResponse;

export type ApiResponsePromise<D> = Promise<ApiResponse<D>>;
export type ApiSuccessResponsePromise<D> = Promise<ApiSuccessResponse<D>>;
export type ApiErrorResponsePromise = Promise<ApiErrorResponse>;

export interface CredentialsDto {
    email: string,
    password: string
}

export type AuthTokenType = 'ACCESS' | 'REFRESH';

export interface AuthTokenDto {
    type: AuthTokenType,
    value: string
}

export interface AccountInfosDto {
    email: string,
    username: string,
    firstName: string,
    lastName: string
}

export interface AuthenticationDto {
    token: AuthTokenDto,
    infos: AccountInfosDto
}

export interface PlaylistDto {
    id: number
    name: string
    tracksCount: number
}