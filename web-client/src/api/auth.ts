import { AxiosError } from "axios";
import { apiClient } from "./client"
import { UserCredentialsDto, TokenDto, ResponseDtoWrapper } from "./dtos";

const BASE_PATH = 'auth';
const LOGIN_ENDPOINT = `${BASE_PATH}/login`;


async function loginUser(credentials: UserCredentialsDto): Promise<TokenDto> {

    try {
        const response = await apiClient.post<ResponseDtoWrapper<TokenDto>>(LOGIN_ENDPOINT, credentials);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError && error.status == 403) {
            throw new AuthError('INVALID_CREDENTIALS')    
        }
        throw new AuthError('UNKNOWN')    
    }
}

type ErrorName =
    | 'INVALID_CREDENTIALS'
    | 'UNKNOWN'

class AuthError extends Error {
    name: ErrorName;
    message: string;
    cause?: Error

    constructor(name: ErrorName, message: string = '', cause?: Error) {
        super();
        this.name = name;
        this.message = message;
        this.cause = cause
    }
}

export default {
    login: loginUser
}