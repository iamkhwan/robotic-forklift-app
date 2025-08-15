import { createContext, useContext } from 'react';

interface AlertContextType {
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
}

const AlertContext = createContext<AlertContextType>({
    showError: () => {},
    showSuccess: () => {}
});

export const useAlert = () => useContext(AlertContext);

export default AlertContext;