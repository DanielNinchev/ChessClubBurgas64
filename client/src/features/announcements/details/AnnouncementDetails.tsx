import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Container, Divider, Paper, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useAccount } from '../../../lib/hooks/useAccount';
import { useAnnouncements } from '../../../lib/hooks/useAnnouncements';
import { formatBulgarianDate } from '../../../lib/util/dateUtils';

export default function AnnouncementDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { announcement, loadingAnnouncement, deleteAnnouncement } = useAnnouncements(id);
    const { isAdmin, isTeacher } = useAccount();
    const canEdit = isAdmin || isTeacher;

    const handleDelete = async () => {
        if (!announcement) return;
        if (window.confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
            await deleteAnnouncement.mutateAsync(announcement.id);
            navigate('/announcements');
        }
    };

    if (loadingAnnouncement) return <LoadingComponent />;
    if (!announcement) return <Typography>Новината не е намерена</Typography>;

    return (
        <Container maxWidth="md" sx={{ pt: 10, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>

                {/* Main photo — full width, natural aspect ratio, NOT cropped */}
                {announcement.mainPhotoUrl && (
                    <Box
                        component="img"
                        src={announcement.mainPhotoUrl}
                        alt={announcement.title}
                        sx={{
                            width: '100%',
                            maxHeight: 520,
                            objectFit: 'contain',   // ← key: no cropping
                            bgcolor: 'grey.100',
                            display: 'block',
                        }}
                    />
                )}

                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

                    {/* Title + actions row */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h4" fontWeight={700}>
                            {announcement.title}
                        </Typography>

                        {canEdit && (
                            <Box display="flex" gap={1} ml={2} flexShrink={0}>
                                <Button
                                    component={Link}
                                    to={`/announcements/update/${announcement.id}`}
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                >
                                    Промени
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                    loading={deleteAnnouncement.isPending}
                                >
                                    Изтрий
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Bulgarian datetime */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}
                    >
                        🕐 {formatBulgarianDate(announcement.date)}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Description */}
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Описание
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {announcement.description}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Full text — rendered as HTML from SunEditor */}
                    <Box
                        dangerouslySetInnerHTML={{ __html: announcement.text }}
                        sx={{
                            lineHeight: 1.8,
                            '& h1, & h2, & h3, & h4': { mt: 2, mb: 1 },
                            '& p': { mb: 1 },
                            '& img': { maxWidth: '100%', borderRadius: 1 },
                            '& ul, & ol': { pl: 3 },
                            '& a': { color: 'primary.main' },
                        }}
                    />

                    {/* Additional photos */}
                    {announcement.photos?.filter(p => !p.isMain).length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Снимки
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {announcement.photos
                                    .filter(p => !p.isMain)
                                    .map(photo => (
                                        <Box
                                            key={photo.id}
                                            component="img"
                                            src={photo.url}
                                            alt=""
                                            sx={{
                                                width: 160,
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                            }}
                                        />
                                    ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}