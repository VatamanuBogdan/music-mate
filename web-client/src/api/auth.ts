import { requestApi } from "./client"
import { CredentialsDto, AuthTokenDto } from "./dtos";

const ENDPOINT_BASE = 'auth';

async function signIn(credentials: CredentialsDto): Promise<AuthTokenDto> {
    const config = {
        method: 'post',
        url: `${ENDPOINT_BASE}/signin`,
        data: credentials,
        withCredentials: true
    }

    return requestApi<AuthTokenDto>(config);
}

async function refreshAccessToken(): Promise<AuthTokenDto> {
    const config = {
        method: 'get',
        url: `${ENDPOINT_BASE}/refresh`,
        withCredentials: true
    }

    return requestApi<AuthTokenDto>(config);
}

export default {
    signIn, refreshAccessToken
}