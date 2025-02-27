import { createContext, PropsWithChildren, useContext, useEffect, useLayoutEffect, useState } from "react";
import { apiClient } from "../api/client";
import AuthApi from "../api/auth";
import { AxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "../api/dtos";
import { Account } from "../types/Account";
import { applyAccessTokenTo } from "../utils/helpers";

interface AuthContextInterface {
    isSignedIn: boolean,
    acccount: Account | null
    signIn: (email: string, password: string) => Promise<boolean>
    signOut: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw Error('useAuth must be used within an AuthProvider')
    }

    return context;
}

export const useAccount = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw Error('useAccount must be used within an AuthProvider')
    }

    if (!context.isSignedIn || !context.acccount) {
        throw Error('useAccount must be used within a logged in context')
    }

    return context.acccount as Account;
}

type AuthProviderProps = PropsWithChildren;

let refreshAccessTokenCache: Promise<string | null> | null = null; 

async function refreshAccessToken(): Promise<string | null> {
    
    if (!refreshAccessTokenCache) {
        refreshAccessTokenCache = (async () => {
            console.log('Refreshing access token')
    
            let accessTokenValue: string | null = null
            try {
                const accessToken = await AuthApi.refreshAccessToken();
                if (accessToken.value === '') {
                    console.warn('Refreshed access token is empty');
                } else {
                    accessTokenValue = accessToken.value;
                }
            } catch(error) {
                console.info(`Refreshing access token failed ${error}`);
            }
        
            refreshAccessTokenCache = null;
            return accessTokenValue;
        })();
    }
    
    return refreshAccessTokenCache;
}

export function AuthProvider({ children }: AuthProviderProps) {
    
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [acccount, setAccount] = useState<Account | null>(null);

    async function signIn(email: string, password: string): Promise<boolean> {
        try {
            const authentication = await AuthApi.signIn({ email, password });
            setAccessToken(authentication.token.value);
            setAccount(authentication.infos);
            console.log('Sign in succeded');
            return true;
        } catch(error) {
            console.error(`Sign in failed ${error}`);
            return false;
        }
    }

    async function signOut(): Promise<boolean> {
        try {
            await AuthApi.signOut()
            setAccessToken(null);
            setAccount(null);
            console.log('Sign out succeded')
        } catch(error) {
            console.error(`Sign out failed ${error}`)
            return false;
        }

        return true;
    }

    useEffect(() => {
        (async () => {           
            const newAccessToken = await refreshAccessToken();
            if (!newAccessToken) {
                return;
            }

            try {
                const account = await AuthApi.fetchAccountInfos(newAccessToken);
                setAccessToken(newAccessToken);
                setAccount(account);
            } catch(error) {
                console.log(`Failed to fetch current account infos ${error}`)
            }
        })();
    }, []);

    useLayoutEffect(() => {

        const interceptor = apiClient.interceptors.request.use((config) => {

            if (accessToken !== null && !config.headers.Authorization) {
                applyAccessTokenTo(accessToken, config);
            }
            return config;
        });

        return () => {
            apiClient.interceptors.request.eject(interceptor);
        };
    }, [accessToken]);

    useLayoutEffect(() => {
    
        const interceptor = apiClient.interceptors.response.use(
            (response) => response, 
            async (error) => {

                const response = error.response.body as ApiErrorResponse
                if (response.error.code !== 'INVALID_ACCESS_TOKEN') {
                    return Promise.reject(error);
                }

                const initialRequest = error.config as AxiosRequestConfig;
                const newAccessToken = await refreshAccessToken();
                setAccessToken(newAccessToken);

                if (newAccessToken) {
                    applyAccessTokenTo(newAccessToken, initialRequest);
                    return apiClient(initialRequest);
                }
        });

        return () => {
            apiClient.interceptors.response.eject(interceptor);
        };
    });

    const contextValue: AuthContextInterface = { 
        isSignedIn: accessToken != null && acccount != null,
        acccount,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
