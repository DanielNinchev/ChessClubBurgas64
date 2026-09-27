import { zodResolver } from '@hookform/resolvers/zod';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Button,
    Container,
    Divider,
    Grid2,
    IconButton,
    Link as MuiLink,
    Paper,
    Typography
} from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { toast } from 'react-toastify';
import { z } from 'zod';
import TextInput from '../../app/shared/components/TextInput';

// Fix Leaflet default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const contactSchema = z.object({
    name: z.string().min(1, 'Името е задължително'),
    email: z.string().email('Невалиден имейл адрес'),
    subject: z.string().min(1, 'Темата е задължителна'),
    message: z.string().min(1, 'Съобщението е задължително'),
});

type ContactSchema = z.infer<typeof contactSchema>;

// TODO: replace the sample emails with the coaches' real addresses
const COACHES = [
    { name: 'Живко Жеков', phone: '0888 454 034', email: 'zhivko.zhekov@example.com' },
    { name: 'Желчо Желев', phone: '0899 941 257', email: 'zhelcho.zhelev@example.com' },
];

// Chess club coordinates (Спортна зала Нефтохимик, Бургас)
const CLUB_POSITION: [number, number] = [42.4975, 27.4595];

export default function ContactsPage() {
    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm<ContactSchema>({
        mode: 'onTouched',
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactSchema) => {
        try {
            // TODO: Send contact form to API
            console.log(data);
            toast.success('Съобщението беше изпратено успешно!');
            reset();
        } catch {
            toast.error('Възникна грешка при изпращане на съобщението.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ pt: { xs: 9, md: 12 }, pb: 6, minHeight: '100vh' }}>
            {/* Header */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <LocationOnIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
                    <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                        Контакти
                    </Typography>
                </Box>
            </Paper>

            <Grid2 container spacing={{ xs: 2, md: 4 }}>
                {/* Map */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: { xs: 280, md: '100%' }, minHeight: { md: 400 } }}>
                        <MapContainer
                            center={CLUB_POSITION}
                            zoom={16}
                            scrollWheelZoom={false}
                            style={{ height: '100%', minHeight: 280, width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={CLUB_POSITION}>
                                <Popup>
                                    <strong>ШК &quot;Бургас 64&quot;</strong><br />
                                    Спортна база &quot;Нефтохимик&quot;, ж.к. Лазур, Бургас
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </Paper>
                </Grid2>

                {/* Contact info */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            Клубът се намира в жилищен комплекс &quot;Лазур&quot; в заграждението на спортната база на
                            &quot;Нефтохимик&quot;, точно срещу залата за акробатика. Влиза се през бялата врата до портала
                            и се продължава напред, докато се стигне бялата едноетажна сграда.
                        </Typography>

                        <Divider sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                За връзка с нас
                            </Typography>
                        </Divider>

                        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" justifyContent="center">
                                <EmailIcon color="primary" />
                                <MuiLink href="mailto:chessburgas64@gmail.com" underline="hover" color="text.primary" fontWeight={500} sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, wordBreak: 'break-all' }}>
                                    chessburgas64@gmail.com
                                </MuiLink>
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            justifyContent="center"
                            mt={3}
                            sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 3, sm: 0 } }}
                        >
                            {COACHES.map((coach, index) => (
                                <Fragment key={coach.name}>
                                    {index > 0 && (
                                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                                    )}
                                    <Box flex={1} display="flex" flexDirection="column" alignItems="center" gap={1} px={2}>
                                        <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
                                            {coach.name}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PhoneIcon color="primary" fontSize="small" />
                                            <MuiLink href={`tel:${coach.phone.replace(/\s/g, '')}`} underline="hover" color="text.primary" fontWeight={500} sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                                                {coach.phone}
                                            </MuiLink>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <EmailIcon color="primary" fontSize="small" />
                                            <MuiLink href={`mailto:${coach.email}`} underline="hover" color="text.primary" fontWeight={500} sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' }, overflowWrap: 'anywhere' }}>
                                                {coach.email}
                                            </MuiLink>
                                        </Box>
                                    </Box>
                                </Fragment>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box display="flex" justifyContent="center" gap={2}>
                            <IconButton component="a" href="https://www.facebook.com/chessburgas64" target="_blank" rel="noopener noreferrer" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton component="a" href="https://www.youtube.com/@chessburgas64" target="_blank" rel="noopener noreferrer" sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                                <YouTubeIcon />
                            </IconButton>
                            <IconButton component="a" href="https://ratings.fide.com/" target="_blank" rel="noopener noreferrer" sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}>
                                <PersonIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid2>
            </Grid2>

            {/* Contact Form */}
            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 4 }, mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <SendIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        Оставете ни съобщение
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2.5} maxWidth="sm" mx="auto">
                    <TextInput label="Име" control={control} name="name" />
                    <TextInput label="Имейл" control={control} name="email" />
                    <TextInput label="Тема" control={control} name="subject" />
                    <TextInput label="Съобщение" control={control} name="message" multiline rows={5} />
                    <Button type="submit" variant="contained" color="primary" size="large" disabled={!isValid || isSubmitting} sx={{ py: 1.5, fontWeight: 600, fontSize: '1rem', mt: 1 }}>
                        {isSubmitting ? 'Изпращане...' : 'Изпрати'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}