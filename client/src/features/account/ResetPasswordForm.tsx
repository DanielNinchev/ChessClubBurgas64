import { zodResolver } from '@hookform/resolvers/zod';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Alert, Box, Button, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';
import { resetPasswordSchema, ResetPasswordSchema } from '../../lib/schemas/resetPasswordSchema';

export default function ResetPasswordForm() {
    const { resetPassword } = useAccount();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const code = searchParams.get('code') ?? '';
    const [success, setSuccess] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<ResetPasswordSchema>({
        mode: 'onTouched',
        resolver: zodResolver(resetPasswordSchema),
    });

    if (!email || !code) {
        return (
            <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                        Невалиден линк
                    </Typography>
                    <Typography color="text.secondary">
                        Линкът за смяна на парола е невалиден или е изтекъл.
                    </Typography>
                    <Button component={Link} to="/forgot-password" sx={{ mt: 2 }}>
                        Заявете нов линк
                    </Button>
                </Paper>
            </Container>
        );
    }

    const onSubmit = (data: ResetPasswordSchema) => {
        setServerErrors([]);
        resetPassword.mutate(
            {
                email,
                token: code,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => setSuccess(true),
                onError: (error: unknown) => {
                    // Handle validation errors from the server
                    if (Array.isArray(error)) {
                        setServerErrors(error.map(String));
                    } else if (error && typeof error === 'object' && 'response' in error) {
                        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]> } } };
                        const errors = axiosError.response?.data?.errors;
                        if (errors) {
                            const messages = Object.values(errors).flat();
                            setServerErrors(messages);
                        } else {
                            setServerErrors(['Неуспешна смяна на паролата. Моля, опитайте отново.']);
                        }
                    } else {
                        setServerErrors(['Неуспешна смяна на паролата. Моля, опитайте отново.']);
                    }
                },
            }
        );
    };

    return (
        <Container maxWidth="xs" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <LockResetIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        Нова парола
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Въведете новата си парола за {email}
                    </Typography>
                </Box>

                {success ? (
                    <Box textAlign="center">
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Паролата ви беше променена успешно!
                        </Alert>
                        <Button component={Link} to="/login" variant="contained">
                            Влезте в профила си
                        </Button>
                    </Box>
                ) : (
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {serverErrors.length > 0 && (
                            <Alert severity="error">
                                {serverErrors.map((err, i) => (
                                    <Typography key={i} variant="body2">{err}</Typography>
                                ))}
                            </Alert>
                        )}

                        <TextInput label="Нова парола" control={control} name="newPassword" type="password" />
                        <TextInput label="Потвърди нова парола" control={control} name="confirmPassword" type="password" />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!isValid || isSubmitting || resetPassword.isPending}
                            fullWidth
                        >
                            {resetPassword.isPending ? 'Промяна...' : 'Промени паролата'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}