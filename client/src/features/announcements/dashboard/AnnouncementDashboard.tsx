import NewspaperIcon from '@mui/icons-material/Newspaper';
import { Box, Container, Grid2, Typography } from '@mui/material';
import AnnouncementList from './AnnouncementList';
import AnnouncementSidebar from './AnnouncementSidebar';

export default function AnnouncementDashboard() {
    return (
        <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <NewspaperIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" color="primary.dark">
                        Новини
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Последни новини и обяви от Шахматен Клуб &quot;Бургас 64&quot;
                </Typography>
            </Box>

            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 8 }}>
                    <AnnouncementList />
                </Grid2>
                <Grid2
                    size={{ xs: 12, md: 4 }}
                    sx={{
                        position: { md: 'sticky' },
                        top: { md: 100 },
                        alignSelf: 'flex-start',
                    }}
                >
                    <AnnouncementSidebar />
                </Grid2>
            </Grid2>
        </Container>
    );
}