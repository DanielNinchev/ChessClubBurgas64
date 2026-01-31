import { AccessTime, ArrowBack } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Paper, Typography } from "@mui/material";
import DOMPurify from 'dompurify';
import { useNavigate, useParams } from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import { formatDate } from "../../../lib/util/util";

export default function AnnouncementDetails() {
    const { id } = useParams();
    const { isLoading, announcement } = useAnnouncements(id);
    const navigate = useNavigate();

    if (isLoading) return <LoadingComponent />
    if (!announcement) return <div>Новината не беше намерена.</div>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/announcements')}
                sx={{ mb: 3 }}
            >
                Назад към новините
            </Button>

            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4, pb: 2 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        {announcement.title}
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(announcement.date)}
                        </Typography>
                    </Box>
                </CardContent>

                <Divider />

                {announcement.mainPhotoUrl && (
                    <CardMedia
                        component="img"
                        image={announcement.mainPhotoUrl}
                        alt={announcement.title}
                        sx={{
                            width: '100%',
                            maxHeight: 600,
                            objectFit: 'cover'
                        }}
                    />
                )}

                <CardContent sx={{ p: 4 }}>
                    {announcement.description && (
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Описание
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {announcement.description}
                            </Typography>
                        </Paper>
                    )}

                    <Box
                        sx={{
                            '& img': {
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: 2,
                                my: 2
                            },
                            '& p': {
                                marginBottom: 2,
                                lineHeight: 1.8
                            },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                                marginTop: 3,
                                marginBottom: 2,
                                fontWeight: 600
                            },
                            '& a': {
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            },
                            '& ul, & ol': {
                                paddingLeft: 3,
                                marginBottom: 2
                            }
                        }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.text) }}
                    />
                </CardContent>
            </Card>
        </Container>
    )
}