import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { ApiResponse } from './response';

const API_ENDPOINT = 'api';

export const apiClient = axios.create({
    baseURL: `${SERVICE_API_HOST}/${API_ENDPOINT}`,
    timeout: CLIENT_REQUEST_TIMEOUT,
});

export async function requestApi<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const result = (await apiClient.request<ApiResponse<T>>(config)).data;
        if (!result) {
            return Promise.resolve(result);
        }
        if (result.status === 'success') {
            return result.data;
        } else {
            throw result.error;
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data;
        } else {
            throw error;
        }
    }
}
