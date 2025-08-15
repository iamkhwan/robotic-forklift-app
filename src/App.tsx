import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import FleetInventory from './pages/FleetInventory';
import CommandSimulation from './pages/CommandSimulation';

export default function App() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container sx={{ flex: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<FleetInventory />} />
          <Route path="/commands" element={<CommandSimulation />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}