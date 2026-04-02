import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Container, Typography } from '@mui/material';
import { NavLink } from 'react-router';

export default function HomePage() {
  return (
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
    </Container>
  );
}