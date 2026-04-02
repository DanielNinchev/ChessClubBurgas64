import { zodResolver } from '@hookform/resolvers/zod';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Alert, Box, Button, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';

const forgotPasswordSchema = z.object({
    email: z.string().email('Невалиден имейл адрес'),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const { forgotPassword } = useAccount();
    const [submitted, setSubmitted] = useState(false);

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<ForgotPasswordSchema>({
        mode: 'onTouched',
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordSchema) => {
        forgotPassword.mutate(data, {
            onSuccess: () => setSubmitted(true),
        });
    };

    return (
        <Container maxWidth="xs" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <LockResetIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        Забравена парола
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Въведете имейл адреса си и ще получите линк за смяна на паролата.
                    </Typography>
                </Box>

                {submitted ? (
                    <Alert severity="success">
                        Ако съществува акаунт с този имейл, ще получите линк за смяна на паролата.
                    </Alert>
                ) : (
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <TextInput label="Имейл" control={control} name="email" />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!isValid || isSubmitting || forgotPassword.isPending}
                            fullWidth
                        >
                            {forgotPassword.isPending ? 'Изпращане...' : 'Изпрати линк'}
                        </Button>
                    </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button component={Link} to="/login" size="small">
                        Обратно към вход
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}