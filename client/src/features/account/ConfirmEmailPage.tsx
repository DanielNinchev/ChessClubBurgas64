import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import agent from '../../lib/api/agent';

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!email || !token) {
            setStatus('error');
            return;
        }

        agent.get('/account/confirm-email', { params: { email, token } })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [email, token]);

    return (
        <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {status === 'loading' && (
                    <Box>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Потвърждаване на имейл...
                        </Typography>
                    </Box>
                )}

                {status === 'success' && (
                    <Box>
                        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
                            Имейлът е потвърден! 🎉
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Регистрацията ви е завършена. Вече можете да влезете в профила си.
                        </Typography>
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                        >
                            Влезте в профила си
                        </Button>
                    </Box>
                )}

                {status === 'error' && (
                    <Box>
                        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                            Грешка
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Линкът за потвърждение е невалиден или е изтекъл.
                        </Typography>
                        <Button
                            component={Link}
                            to="/"
                            variant="outlined"
                        >
                            Към началната страница
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}