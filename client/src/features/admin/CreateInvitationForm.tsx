import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAccount } from '../../lib/hooks/useAccount';

export default function CreateInvitationForm() {
    const { createInvitation } = useAccount();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<string>('Student');
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createInvitation.mutate(
            { email, role },
            {
                onSuccess: (data) => {
                    setGeneratedLink(data.registrationLink);
                    setCopied(false);
                },
            }
        );
    };

    const handleCopy = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ pt: 12, pb: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Typography variant="h5" fontWeight={700} color="primary.dark" gutterBottom>
                    Генериране на покана за регистрация
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Въведете имейл адреса на лицето и изберете роля.
                    Ще бъде генериран линк за регистрация, валиден 7 дни.
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Имейл"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel>Роля</InputLabel>
                        <Select
                            value={role}
                            label="Роля"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="Student">Ученик</MenuItem>
                            <MenuItem value="Teacher">Учител</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SendIcon />}
                        disabled={!email || createInvitation.isPending}
                        size="large"
                    >
                        {createInvitation.isPending ? 'Генериране...' : 'Генерирай покана'}
                    </Button>
                </Box>

                {generatedLink && (
                    <Alert
                        severity="success"
                        sx={{ mt: 3, wordBreak: 'break-all' }}
                        action={
                            <Tooltip title={copied ? 'Копирано!' : 'Копирай'}>
                                <IconButton size="small" onClick={handleCopy}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <Typography variant="subtitle2" gutterBottom>
                            Линк за регистрация:
                        </Typography>
                        <Typography variant="body2" fontFamily="monospace">
                            {generatedLink}
                        </Typography>
                    </Alert>
                )}
            </Paper>
        </Container>
    );
}