import axios from 'axios';

// TODO: Remove hardcoded values and use env values instead
const API_SERVICE_URL = 'http://localhost:8080';
const API_BASE_ENDPOINT = 'api'
const REQUEST_TIMEOUT = 10000;

export const apiClient = axios.create({
    baseURL: `${API_SERVICE_URL}/${API_BASE_ENDPOINT}`,
    timeout: REQUEST_TIMEOUT
});