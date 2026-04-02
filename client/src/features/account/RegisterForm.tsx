import { zodResolver } from '@hookform/resolvers/zod';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';
import { registerSchema, RegisterSchema } from '../../lib/schemas/registerSchema';

export default function RegisterForm() {
    const { registerUser, validateInvitation } = useAccount();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [invitationEmail, setInvitationEmail] = useState<string | null>(null);
    const [invitationRole, setInvitationRole] = useState<string | null>(null);
    const [validating, setValidating] = useState(true);
    const [invalidToken, setInvalidToken] = useState(false);

    const { control, handleSubmit, setValue, formState: { isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (!token) {
            setInvalidToken(true);
            setValidating(false);
            return;
        }

        validateInvitation.mutate(token, {
            onSuccess: (data) => {
                setInvitationEmail(data.email);
                setInvitationRole(data.role);
                setValue('email', data.email);
                setValidating(false);
            },
            onError: () => {
                setInvalidToken(true);
                setValidating(false);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onSubmit = (data: RegisterSchema) => {
        registerUser.mutate(
            {
                ...data,
                invitationToken: token!,
            },
            {
                onSuccess: () => navigate('/account/registerSuccess'),
                onError: (error: unknown) => {
                    if (Array.isArray(error)) {
                        console.log(error);
                    }
                },
            }
        );
    };

    if (validating) {
        return (
            <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
                <Typography>Проверка на поканата...</Typography>
            </Container>
        );
    }

    if (invalidToken) {
        return (
            <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                        Невалидна покана
                    </Typography>
                    <Typography color="text.secondary">
                        Линкът за регистрация е невалиден или е изтекъл.
                        Моля, свържете се с администратора за нова покана.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        sx={{ mt: 3 }}
                    >
                        Към началната страница
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        Регистрация
                    </Typography>
                    {invitationRole && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Роля: {invitationRole === 'Student' ? 'Ученик' : 'Учител'}
                        </Typography>
                    )}
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextInput
                        label="Имейл"
                        control={control}
                        name="email"
                        disabled
                    />
                    <TextInput label="Име" control={control} name="firstName" />
                    <TextInput label="Презиме" control={control} name="middleName" />
                    <TextInput label="Фамилия" control={control} name="lastName" />
                    <TextInput label="Парола" control={control} name="password" type="password" />
                    <TextInput label="Потвърди парола" control={control} name="confirmPassword" type="password" />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isValid || isSubmitting}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        {registerUser.isPending ? 'Регистрация...' : 'Регистрирай се'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}