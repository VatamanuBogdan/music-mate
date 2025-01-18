import { createContext, PropsWithChildren, useContext, useEffect, useLayoutEffect, useState } from "react";
import { apiClient } from "../api/client";
import AuthApi from "../api/auth";
import { AxiosHeaders, AxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "../api/dtos";

type AuthContextInterface = {
    isSignedIn: boolean,
    signIn: (email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw Error('useAuth must be used within an AuthProvider')
    }

    return context;
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

    async function signIn(email: string, password: string) {
        try {
            const authToken = await AuthApi.signIn({ email, password });
            setAccessToken(authToken.value);
            console.log('Sign in succeded');
            return true;
        } catch(error) {
            console.error(`Sign in failed ${error}`);
            return false;
        }
    }

    useEffect(() => {
        (async () => { 
            const newAccessToken = await refreshAccessToken();
            setAccessToken(newAccessToken); 
        })();
    }, []);

    useLayoutEffect(() => {

        const interceptor = apiClient.interceptors.request.use((config) => {

            if (accessToken !== null && !config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${accessToken}`
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
                    if (!initialRequest.headers) {
                        initialRequest.headers = new AxiosHeaders();
                    }

                    initialRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(initialRequest)
                }
        });

        return () => {
            apiClient.interceptors.response.eject(interceptor);
        };
    });

    const value: AuthContextInterface = { 
        isSignedIn: accessToken != null,
        signIn: signIn 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
