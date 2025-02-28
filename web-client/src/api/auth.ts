import { requestApi } from './client';
import {
    AccountInfosDto,
    AuthTokenDto,
    AuthenticationDto,
    CredentialsDto,
    SignUpDataDto,
} from './dtos';
import { applyAccessTokenTo } from '../utils/helpers';

const ENDPOINT_BASE = 'auth';

async function signIn(credentials: CredentialsDto): Promise<AuthenticationDto> {
    const config = {
        method: 'post',
        url: `${ENDPOINT_BASE}/signin`,
        data: credentials,
        withCredentials: true,
    };

    return requestApi<AuthenticationDto>(config);
}

async function signUp(data: SignUpDataDto): Promise<AuthenticationDto> {
    const config = {
        method: 'post',
        url: `${ENDPOINT_BASE}/signup`,
        data,
        withCredentials: true,
    };

    return requestApi<AuthenticationDto>(config);
}

async function signOut(): Promise<void> {
    const config = {
        method: 'post',
        url: `${ENDPOINT_BASE}/signout`,
        withCredentials: true,
    };

    return requestApi<void>(config);
}

async function refreshAccessToken(): Promise<AuthTokenDto> {
    const config = {
        method: 'get',
        url: `${ENDPOINT_BASE}/refresh`,
        withCredentials: true,
    };

    return requestApi<AuthTokenDto>(config);
}

async function fetchAccountInfos(accessToken?: string): Promise<AccountInfosDto> {
    const config = {
        method: 'get',
        url: `${ENDPOINT_BASE}/account`,
    };

    if (accessToken) {
        applyAccessTokenTo(accessToken, config);
    }

    return requestApi<AccountInfosDto>(config);
}

export default {
    signIn,
    signUp,
    signOut,
    refreshAccessToken,
    fetchAccountInfos,
};
