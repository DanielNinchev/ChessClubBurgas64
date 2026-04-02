import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { useAccount } from "../../lib/hooks/useAccount";

type Props = {
    email: string;
}

export default function RegisterSuccess({ email }: Props) {
    const { resendConfirmationEmail } = useAccount();

    const handleResend = async () => {
        await resendConfirmationEmail.mutateAsync({ email });
    };

    return (
        <Paper
            elevation={3}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                maxWidth: 480,
                mx: 'auto',
            }}
        >
            <CheckCircleOutline sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Регистрацията е успешна!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Моля, проверете електронната си поща, за да потвърдите акаунта си.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleResend}
                disabled={resendConfirmationEmail.isPending}
                sx={{ px: 4, py: 1.2, fontWeight: 600 }}
            >
                {resendConfirmationEmail.isPending
                    ? 'Изпращане...'
                    : 'Препращане на имейл за потвърждение'}
            </Button>
        </Paper>
    );
}