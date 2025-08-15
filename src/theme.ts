import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#FFC107',
        },
        secondary: {
            main: '#212121',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});