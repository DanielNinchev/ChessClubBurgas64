import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet, ScrollRestoration } from 'react-router';
import { ToastContainer } from 'react-toastify';
import theme from '../theme/theme';
import NavBar from './NavBar';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <ScrollRestoration />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Semi-transparent overlay for readability */}
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: 'rgba(240, 244, 248, 0.82)',
          }}
        >
          <NavBar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
