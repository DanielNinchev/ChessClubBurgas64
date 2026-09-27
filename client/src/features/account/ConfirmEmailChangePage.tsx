import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useAccount } from '../../lib/hooks/useAccount';

export default function ConfirmEmailChangePage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId') ?? '';
    const newEmail = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';
    const { confirmEmailChange } = useAccount();
    const submitted = useRef(false);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!userId || !newEmail || !token) {
            setStatus('error');
            return;
        }
        // The token is single-use, so guard against StrictMode's double effect run
        if (submitted.current) return;
        submitted.current = true;

        confirmEmailChange.mutateAsync({ userId, newEmail, token })
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [userId, newEmail, token, confirmEmailChange]);

    return (
        <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {status === 'loading' && (
                    <Box>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Потвърждаване на новия имейл...
                        </Typography>
                    </Box>
                )}

                {status === 'success' && (
                    <Box>
                        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
                            Имейлът е сменен!
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Вече можете да влизате с <strong>{newEmail}</strong>.
                        </Typography>
                        <Button component={Link} to="/login" variant="contained" size="large">
                            Вход
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
                        <Button component={Link} to="/" variant="outlined">
                            Към началната страница
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
