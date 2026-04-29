import { zodResolver } from '@hookform/resolvers/zod';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';

const invitationSchema = z.object({
    email: z.string().email('Въведете валиден имейл'),
    role: z.string().min(1, 'Изберете роля'),
});

type InvitationSchema = z.infer<typeof invitationSchema>;

export default function CreateInvitationForm() {
    const { createInvitation } = useAccount();
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm<InvitationSchema>({
        mode: 'onTouched',
        resolver: zodResolver(invitationSchema),
        defaultValues: {
            email: '',
            role: '',
        },
    });

    const onSubmit = (data: InvitationSchema) => {
        setGeneratedLink(null);
        setCopied(false);
        createInvitation.mutate(data, {
            onSuccess: (result) => {
                setGeneratedLink(result.registrationLink);
                setExpiresAt(result.expiresAt);
            },
        });
    };

    const handleCopy = async () => {
        if (generatedLink) {
            await navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNewInvitation = () => {
        setGeneratedLink(null);
        setExpiresAt(null);
        setCopied(false);
        reset();
    };

    return (
        <Container maxWidth="sm" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        Генериране на покана
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Създайте линк за регистрация и го изпратете на новия потребител
                    </Typography>
                </Box>

                {!generatedLink ? (
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                    >
                        <TextInput
                            label="Имейл на поканения"
                            control={control}
                            name="email"
                            type="email"
                        />

                        <Controller
                            name="role"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormControl fullWidth error={!!fieldState.error}>
                                    <InputLabel>Роля</InputLabel>
                                    <Select {...field} label="Роля">
                                        <MenuItem value="Student">🎓 Ученик</MenuItem>
                                        <MenuItem value="Teacher">👨‍🏫 Учител</MenuItem>
                                    </Select>
                                    {fieldState.error && (
                                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!isValid || isSubmitting || createInvitation.isPending}
                            startIcon={<LinkIcon />}
                            sx={{ mt: 1 }}
                        >
                            {createInvitation.isPending ? 'Генериране...' : 'Генерирай покана'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                            Поканата е генерирана успешно! Копирайте линка и го изпратете на потребителя.
                        </Alert>

                        <TextField
                            label="Линк за регистрация"
                            value={generatedLink}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title={copied ? 'Копирано!' : 'Копирай'}>
                                            <IconButton onClick={handleCopy} edge="end">
                                                <ContentCopyIcon
                                                    color={copied ? 'success' : 'inherit'}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace',
                                },
                            }}
                        />

                        {expiresAt && (
                            <Typography variant="caption" color="text.secondary" textAlign="center">
                                Линкът е валиден до: {new Date(expiresAt).toLocaleDateString('bg-BG', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Typography>
                        )}

                        <Button
                            variant="outlined"
                            onClick={handleNewInvitation}
                            startIcon={<PersonAddIcon />}
                            sx={{ mt: 1 }}
                        >
                            Нова покана
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}