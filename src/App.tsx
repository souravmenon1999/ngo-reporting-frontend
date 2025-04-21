import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ bgcolor: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            NGO Reporting
          </Typography>
          <Box>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: 'white',
                marginRight: '1.5rem',
                textDecoration: isActive ? 'underline' : 'none',
                fontWeight: isActive ? 600 : 400,
              })}
            >
              Submit Report
            </NavLink>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
                fontWeight: isActive ? 600 : 400,
              })}
            >
              Dashboard
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<ReportForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
