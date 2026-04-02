import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router';
import { Announcement } from '../../../lib/types';

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: Props) {
  const formattedDate = new Date(announcement.date).toLocaleDateString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card
      component={Link}
      to={`/announcements/${announcement.id}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      {announcement.mainPhotoUrl && (
        <CardMedia
          component="img"
          image={announcement.mainPhotoUrl}
          alt={announcement.title}
          sx={{
            width: { xs: '100%', sm: 240 },
            height: { xs: 200, sm: 'auto' },
            objectFit: 'cover',
            minHeight: { sm: 180 },
          }}
        />
      )}

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="primary.dark"
            sx={{
              mb: 1,
              fontWeight: 700,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {announcement.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.7,
            }}
          >
            {announcement.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Chip
            icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
            label={formattedDate}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              color: 'text.secondary',
              borderColor: 'divider',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}