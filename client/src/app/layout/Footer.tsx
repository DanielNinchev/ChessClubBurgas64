import { Email, Facebook, Instagram, Phone, Place } from '@mui/icons-material';
import { Box, Container, Divider, IconButton, Stack, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'rgba(13, 110, 138, 0.95)',
                color: 'white',
                py: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    {/* Logo & Name */}
                    <Stack alignItems={{ xs: 'center', md: 'flex-start' }} spacing={1}>
                        <Box
                            component="img"
                            src="/images/logo.png"
                            alt="ЛОГО НА ШК БУРГАС-64"
                            sx={{ width: 64, height: 64, objectFit: 'contain' }}
                        />
                        <Typography variant="h6" fontWeight={700}>
                            ШАХМАТЕН КЛУБ "БУРГАС-64"
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Развиваме шахматния потенциал на Бургас
                        </Typography>
                    </Stack>

                    {/* Contact Info */}
                    <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Контакти
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Place fontSize="small" />
                            <Typography variant="body2">гр. Бургас, ул. Примерна 1</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Email fontSize="small" />
                            <Typography variant="body2">info@burgas64.bg</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">+359 88 888 8888</Typography>
                        </Stack>
                    </Stack>

                    {/* Social */}
                    <Stack alignItems={{ xs: 'center', md: 'flex-start' }} spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                            Социални мрежи
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                href="https://facebook.com"
                                target="_blank"
                                sx={{ color: 'white', '&:hover': { color: '#4267B2' } }}
                            >
                                <Facebook />
                            </IconButton>
                            <IconButton
                                href="https://instagram.com"
                                target="_blank"
                                sx={{ color: 'white', '&:hover': { color: '#E1306C' } }}
                            >
                                <Instagram />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 3 }} />

                <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7 }}>
                    © {new Date().getFullYear()} ШАХМАТЕН КЛУБ "БУРГАС-64". Всички права запазени.
                </Typography>
            </Container>
        </Box>
    );
}