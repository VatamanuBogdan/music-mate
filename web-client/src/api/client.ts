import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from './dtos';

// TODO: Remove hardcoded values and use env values instead
const API_SERVICE_URL = 'http://localhost:8080';
const API_BASE_ENDPOINT = 'api'
const REQUEST_TIMEOUT = 10000;

export const apiClient = axios.create({
    baseURL: `${API_SERVICE_URL}/${API_BASE_ENDPOINT}`,
    timeout: REQUEST_TIMEOUT
});

export async function requestApi<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const result = (await apiClient.request<ApiResponse<T>>(config)).data;
        if (result.status === 'success') {
            return result.data;
        } else {
            throw result.error;
        }
    } catch(error) {
        if (error instanceof AxiosError) {
            throw error.response?.data;
        } else {
            throw error;
        }
    }
}
