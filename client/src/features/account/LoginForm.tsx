import { zodResolver } from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";

export default function LoginForm() {
    const [notVerified, setNotVerified] = useState(false);
    const { loginUser, resendConfirmationEmail } = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const { control, handleSubmit, watch, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    });
    const email = watch('email');

    const handleResendEmail = async () => {
        try {
            await resendConfirmationEmail.mutateAsync({ email });
            setNotVerified(false);
        } catch (error) {
            console.log(error);
            toast.error('Възникна грешка при изпращането на имейла - моля, проверете електронната си поща.');
        }
    }

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || '/announcements');
            },
            onError: error => {
                if (error.message === 'NotAllowed') {
                    setNotVerified(true);
                }
            }
        });
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                pt: 10,
                pb: 4,
            }}
        >
            <Paper
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    gap: 2.5,
                    width: '100%',
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
            >
                <Box display='flex' alignItems='center' justifyContent='center'
                    gap={2} color='primary.main'>
                    <LockOpen fontSize="large" />
                    <Typography variant="h4" fontWeight={700}>Вход</Typography>
                </Box>
                <TextInput label='Имейл' control={control} name='email' />
                <TextInput label='Парола' type='password' control={control} name='password' />
                <Button
                    type='submit'
                    disabled={!isValid || isSubmitting}
                    variant="contained"
                    size="large"
                    sx={{ py: 1.5, fontWeight: 600, fontSize: '1rem', mt: 1 }}
                >
                    {isSubmitting ? 'Влизане...' : 'Вход'}
                </Button>
                {notVerified ? (
                    <Box display='flex' flexDirection='column' justifyContent='center'>
                        <Typography textAlign='center' color='error'>
                            Електронната Ви поща все още не е потвърдена. Можете да натиснете бутона за препращане на имейла за потвърждение.
                        </Typography>
                        <Button
                            disabled={resendConfirmationEmail.isPending}
                            onClick={handleResendEmail}
                        >
                            Препращане на имейла за потвърждение
                        </Button>
                    </Box>
                ) : (
                    <Box display='flex' flexDirection='column' alignItems='center' gap={1}>
                        <Typography>
                            Забравена парола? Натиснете{' '}
                            <Typography component={Link} to='/forgot-password' color="primary" fontWeight={600}>
                                тук
                            </Typography>
                        </Typography>
                        <Typography>
                            Нямате акаунт?{' '}
                            <Typography component={Link} to='/register' color="primary" fontWeight={600}>
                                Регистрация
                            </Typography>
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}