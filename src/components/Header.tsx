import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import WarehouseIcon from '@mui/icons-material/Warehouse';

export default function Header() {
    const location = useLocation();

    return (
        <AppBar position="static" color="secondary" elevation={0} sx={{ borderRadius: 0 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center" gap={1} >
                    <WarehouseIcon fontSize="large" color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Forklift Control System
                    </Typography>
                </Box>
                <Box>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        sx={{ borderBottom: location.pathname === '/' ? '2px solid #FFC107' : 'none' }}
                    >
                        Fleet Inventory
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/commands"
                        sx={{ borderBottom: location.pathname === '/commands' ? '2px solid #FFC107' : 'none' }}
                    >
                        Command Simulation
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}