import { applyAccessTokenTo } from "../utils/helpers";
import { requestApi } from "./client"
import { CredentialsDto, AuthTokenDto, AuthenticationDto, AccountInfosDto } from "./dtos";

const ENDPOINT_BASE = 'auth';

async function signIn(credentials: CredentialsDto): Promise<AuthenticationDto> {
    const config = {
        method: 'post',
        url: `${ENDPOINT_BASE}/signin`,
        data: credentials,
        withCredentials: true
    }

    return requestApi<AuthenticationDto>(config);
}

async function refreshAccessToken(): Promise<AuthTokenDto> {
    const config = {
        method: 'get',
        url: `${ENDPOINT_BASE}/refresh`,
        withCredentials: true
    }

    return requestApi<AuthTokenDto>(config);
}

async function fetchAccountInfos(accessToken?: string): Promise<AccountInfosDto> {
    const config = {
        method: 'get',
        url: `${ENDPOINT_BASE}/account`
    }

    if (accessToken) {
        applyAccessTokenTo(accessToken, config);
    }

    return requestApi<AccountInfosDto>(config);
}

export default {
    signIn, refreshAccessToken, fetchAccountInfos
}