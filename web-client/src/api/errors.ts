class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly message: string;
    public readonly details: string | undefined;

    constructor(error: { code: ApiErrorCode; message: string; details: string | undefined }) {
        super();
        this.code = error.code;
        this.message = error.message;
        this.details = error.details;
    }
}

type ApiErrorCode =
    | 'NOT_REGISTERED'
    | 'ALREADY_EXISTS'
    | 'INVALID_CREDENTIALS'
    | 'INVALID_ACCESS_TOKEN'
    | 'INVALID_REFRESH_TOKEN'
    | 'UNKNOWN';

export type { ApiErrorCode, ApiError };
