import { EmailRounded } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";

export default function VerifyEmail() {
    const { verifyEmail, resendConfirmationEmail } = useAccount();
    const [status, setStatus] = useState('verifying');
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const code = searchParams.get('code');
    const hasRun = useRef(false);

    useEffect(() => {
        if (code && userId && !hasRun.current) {
            hasRun.current = true;
            verifyEmail.mutateAsync({ userId, code })
                .then(() => setStatus('verified'))
                .catch(() => setStatus('failed'))
        }
    }, [code, userId, verifyEmail])

    const getBody = () => {
        switch (status) {
            case 'verifying':
                return <Typography>Verifying...</Typography>
            case 'failed':
                return (
                    <Box display='flex' flexDirection='column' gap={2} justifyContent='center'>
                        <Typography>
                            Неуспешно потвърждение. Можете да опитате да изпратите отново линка за потвърждение на електронната си поща.
                        </Typography>
                        <Button
                            onClick={() => resendConfirmationEmail.mutate({ userId })}
                            disabled={resendConfirmationEmail.isPending}
                        >
                            Препращане на имейла за потвърждение
                        </Button>
                    </Box>
                );
            case 'verified':
                return (
                    <Box display='flex' flexDirection='column' gap={2} justifyContent='center'>
                        <Typography>
                            Електронната Ви поща е потвърдена! Можете да се впишете сега.
                        </Typography>
                        <Button component={Link} to='/login'>
                            Вход
                        </Button>
                    </Box>
                );
        }
    }

    return (
        <Paper
            sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6
            }}
        >
            <EmailRounded sx={{ fontSize: 100 }} color='primary' />
            <Typography gutterBottom variant="h3">
                Потвърждение на електронната поща
            </Typography>
            <Divider />
            {getBody()}
        </Paper>
    )
}