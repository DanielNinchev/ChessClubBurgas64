import { zodResolver } from '@hookform/resolvers/zod';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router';
import { z } from 'zod';
import LoadingComponent from '../../app/layout/LoadingComponent';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';

const registerSchema = z.object({
    firstName: z.string().min(1, 'Името е задължително'),
    middleName: z.string().min(1, 'Презимето е задължително'),
    lastName: z.string().min(1, 'Фамилията е задължителна'),
    password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Паролите не съвпадат',
    path: ['confirmPassword'],
});

type RegisterSchema = z.infer<typeof registerSchema>;

const roleLabels: Record<string, string> = {
    Student: '🎓 Ученик',
    Teacher: '👨‍🏫 Учител',
};

export default function RegisterForm() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const { validateInvitation, registerUser, resendConfirmation } = useAccount();

    const [invitationEmail, setInvitationEmail] = useState<string | null>(null);
    const [invitationRole, setInvitationRole] = useState<string | null>(null);
    const [invitationError, setInvitationError] = useState<string | null>(null);
    const [validating, setValidating] = useState(true);
    const [success, setSuccess] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [resent, setResent] = useState(false);

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
    });

    // Validate the invitation token on mount
    useEffect(() => {
        if (!token) {
            setInvitationError('Липсва код за покана. Моля, използвайте линка, изпратен от администратора.');
            setValidating(false);
            return;
        }

        validateInvitation.mutate(token, {
            onSuccess: (data) => {
                setInvitationEmail(data.email);
                setInvitationRole(data.role);
                setValidating(false);
            },
            onError: () => {
                setInvitationError('Поканата е невалидна или е изтекла.');
                setValidating(false);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onSubmit = (data: RegisterSchema) => {
        if (!invitationEmail) return;
        setServerErrors([]);

        registerUser.mutate(
            {
                email: invitationEmail,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                password: data.password,
                invitationToken: token,
            },
            {
                onSuccess: () => setSuccess(true),
                onError: (error: unknown) => {
                    if (error && typeof error === 'object' && 'response' in error) {
                        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]> } } };
                        const errors = axiosError.response?.data?.errors;
                        if (errors) {
                            setServerErrors(Object.values(errors).flat());
                        } else {
                            setServerErrors(['Неуспешна регистрация. Моля, опитайте отново.']);
                        }
                    } else {
                        setServerErrors(['Неуспешна регистрация. Моля, опитайте отново.']);
                    }
                },
            }
        );
    };

    const handleResend = () => {
        if (!invitationEmail) return;
        resendConfirmation.mutate(invitationEmail, {
            onSuccess: () => setResent(true),
        });
    };

    if (validating) return <LoadingComponent />;

    if (invitationError) {
        return (
            <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                        Невалидна покана
                    </Typography>
                    <Typography color="text.secondary">
                        {invitationError}
                    </Typography>
                    <Button component={Link} to="/" sx={{ mt: 2 }}>
                        Към началната страница
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Success — show "check your email"
    if (success) {
        return (
            <Container maxWidth="xs" sx={{ pt: 16, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <MarkEmailReadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark" gutterBottom>
                        Потвърдете имейла си
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                        Изпратихме линк за потвърждение на
                    </Typography>
                    <Typography fontWeight={600} sx={{ mb: 2 }}>
                        {invitationEmail}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Кликнете върху линка в имейла, за да завършите регистрацията.
                        Проверете и папка „Спам", ако не намирате писмото.
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={handleResend}
                        disabled={resendConfirmation.isPending || resent}
                        sx={{ mb: 1 }}
                    >
                        {resent
                            ? 'Изпратено! ✓'
                            : resendConfirmation.isPending
                                ? 'Изпращане...'
                                : 'Изпрати отново'}
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <HowToRegIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        Регистрация
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Попълнете данните си, за да завършите регистрацията
                    </Typography>
                </Box>

                {/* Invitation info */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        p: 2,
                        mb: 3,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">Имейл:</Typography>
                        <Typography variant="body2" fontWeight={600}>{invitationEmail}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">Роля:</Typography>
                        <Chip
                            label={roleLabels[invitationRole ?? ''] ?? invitationRole}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                </Box>

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

                    <TextInput label="Име" control={control} name="firstName" />
                    <TextInput label="Презиме" control={control} name="middleName" />
                    <TextInput label="Фамилия" control={control} name="lastName" />
                    <TextInput label="Парола" control={control} name="password" type="password" />
                    <TextInput label="Потвърди парола" control={control} name="confirmPassword" type="password" />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isValid || isSubmitting || registerUser.isPending}
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