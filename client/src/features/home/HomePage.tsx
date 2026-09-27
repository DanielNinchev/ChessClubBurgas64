import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router';
import { useAccount } from '../../lib/hooks/useAccount';

export default function HomePage() {
  const { currentUser, loadingUser } = useAccount();
  const navigate = useNavigate();

  return (
    // Logged-in users have nothing to do here - a click anywhere takes them to the news
    <Box
      onClick={currentUser ? () => navigate('/announcements') : undefined}
      sx={{ cursor: currentUser ? 'pointer' : 'default' }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        {/* Frosted-glass card: blurs the background only behind the content */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 640,
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 5 },
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
          }}
        >
          {/* Club Logo - large, no background/border */}
          <Box
            component="img"
            src="/images/logo.png"
            alt="ЛОГО БУРГАС-64"
            sx={{
              width: { xs: '60%', sm: '50%', md: '40%' },
              maxWidth: 320,
              height: 'auto',
              objectFit: 'contain',
              mb: 2,
            }}
          />

          <Typography
            variant="h3"
            color="primary.dark"
            sx={{ fontWeight: 800, mb: 1 }}
          >
            ШАХМАТЕН КЛУБ
          </Typography>
          <Typography
            variant="h3"
            color="primary.main"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            &quot;БУРГАС-64&quot;
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500 }}
          >
            Добре дошли! Присъединете се към нашата шахматна общност в Бургас.
          </Typography>

          {currentUser ? (
            <Typography variant="body2" color="primary.dark" sx={{ fontWeight: 600 }}>
              Натиснете където и да е, за да видите новините
            </Typography>
          ) : !loadingUser && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Вход
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}