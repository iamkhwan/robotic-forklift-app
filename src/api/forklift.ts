import { api, isAxiosError } from './api';

export interface Forklift {
    name: string;
    modelNumber: string;
    manufacturingDate: string;
}

export interface ForkliftCommand { 
    modelNumber: string;
    command: string;
    actionDate: string;
}

// For testing
// const mockForklifts: Forklift[] = [
//     {
//         name: 'Forklift A',
//         modelNumber: 'M-1234',
//         manufacturingDate: '2023-01-15',
//     },
//     {
//         name: 'Forklift B',
//         modelNumber: 'M-5678',
//         manufacturingDate: '2022-05-20',
//     },
//     {
//         name: 'Forklift C',
//         modelNumber: 'M-9101',
//         manufacturingDate: '2024-03-10',
//     },
// ];

export const getForklifts = async (): Promise<Forklift[]> => {
    try {
        const response = await api.get('/forklifts');
        return response.data;
    }
    catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response.data.message);
        }
        else if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch forklift data.');
    }
};

export const uploadForklifts = async (forklifts: Forklift[]): Promise<void> => {
    try {
        await api.post('/forklifts/upload', forklifts, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
    catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response.data.message);
        } 
        else if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to upload forklift data.');
    }
};

export const submitForkliftCommand = async (forkliftCommand: ForkliftCommand): Promise<boolean> => {
    try {
        const response = await api.post('/forklifts/command', forkliftCommand);
        return response.status === 200;
    }
    catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response.data.message);
        }
        else if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to submit forklift command.');
    }
}

export const getForkliftCommands = async (modelNumber: string): Promise<ForkliftCommand[]> => {
    try {
        const response = await api.get(`/forklifts/commands/${modelNumber}`);
        return response.data;
    }
    catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response.data.message);
        }
        else if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch forklift commands.');
    }
};