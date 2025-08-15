import { useState, type ReactNode } from 'react';
import AlertContext from './AlertContext';
import { Snackbar, Alert } from '@mui/material';

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<'error' | 'success'>('success');

    const showError = (msg: string) => {
        setSeverity('error');
        setMessage(msg);
    };

    const showSuccess = (msg: string) => {
        setSeverity('success');
        setMessage(msg);
    };

    return (
        <AlertContext.Provider value={{ showError, showSuccess }}>
            {children}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={severity} onClose={() => setMessage(null)}>
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
}