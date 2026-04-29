import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useAccount } from '../../../lib/hooks/useAccount';
import { useAnnouncements } from '../../../lib/hooks/useAnnouncements';
import { Announcement } from '../../../lib/types';
import { formatBulgarianDateOnly } from '../../../lib/util/dateUtils';

type Props = { announcement: Announcement };

export default function AnnouncementCard({ announcement }: Props) {
  const { isAdmin, isTeacher } = useAccount();
  const canEdit = isAdmin || isTeacher;
  const { deleteAnnouncement } = useAnnouncements();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
      deleteAnnouncement.mutate(announcement.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/announcements/update/${announcement.id}`);
  };

  const formattedDate = new Date(announcement.date).toLocaleDateString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card
      sx={{
        display: 'flex',
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/announcements/${announcement.id}`}
        sx={{ display: 'flex', alignItems: 'stretch', flexGrow: 1 }}
      >
        {/* Image */}
        {announcement.mainPhotoUrl && (
          <CardMedia
            component="img"
            image={announcement.mainPhotoUrl}
            alt={announcement.title}
            sx={{
              width: 200,
              minHeight: 160,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        )}

        {/* Content */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
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

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={formatBulgarianDateOnly(announcement.date)}
              size="small"
              variant="outlined"
              icon={<span style={{ fontSize: 12 }}>📅 </span>}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Edit / Delete buttons — only for admins/teachers */}
      {canEdit && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={1}
          sx={{ p: 1.5, borderLeft: '1px solid', borderColor: 'divider' }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ whiteSpace: 'nowrap' }}
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
            sx={{ whiteSpace: 'nowrap' }}
          >
            Изтрий
          </Button>
        </Box>
      )}
    </Card>
  );
}