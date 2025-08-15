import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: `${apiBaseUrl}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const isAxiosError = (error: unknown): error is { response: { data: { message: string } } } => {
    if (typeof error !== 'object' || error === null) return false;

    const errObj = error as Record<string, unknown>;
    const response = errObj.response;
    if (typeof response !== 'object' || response === null) return false;

    const responseObj = response as Record<string, unknown>;
    const data = responseObj.data;
    if (typeof data !== 'object' || data === null) return false;

    const dataObj = data as Record<string, unknown>;
    
    if ('message' in dataObj && typeof dataObj.message === 'string') {
        return true;
    }

    return false;
};

export { api, isAxiosError };