import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box component="footer" sx={{ p: 2, bgcolor: 'grey.200', textAlign: 'center' }}>
            <Typography variant="body2">
                © {new Date().getFullYear()} Forklift Control System | Puttarak Boonyatham (Khwan)
            </Typography>
        </Box>
    );
}