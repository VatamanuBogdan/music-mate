type HttpStatus = string;

interface ResponseDtoWrapper<D> {
    status: HttpStatus,
    message: string,
    data: D
}

interface UserCredentialsDto {
    email: string,
    password: string
}

interface TokenDto {
    authToken: {
        type: string,
        value: string
    }
}

export type {
    ResponseDtoWrapper,
    UserCredentialsDto,
    TokenDto
}