import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useAnnouncements } from '../../../lib/hooks/useAnnouncements';
import { useStore } from '../../../lib/hooks/useStore';
import { Announcement, PagedResult } from '../../../lib/types';
import AnnouncementCard from './AnnouncementCard';

const AnnouncementList = observer(function AnnouncementList() {
  const { announcementsGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useAnnouncements();

  const announcements = useMemo(() => {
    if (!announcementsGroup) return [];
    return announcementsGroup.pages.flatMap((page: PagedResult<Announcement, string | null>) => page.items);
  }, [announcementsGroup]);

  const { announcementStore } = useStore();
  const { searchTerm, sortBy, dateFilter } = announcementStore;

  // Flatten all pages into a single array
  const allAnnouncements = useMemo(() => {
    if (!announcementsGroup?.pages) return [];
    return announcementsGroup.pages.flatMap(page => page.items);
  }, [announcementsGroup]);

  const filteredAndSorted = useMemo(() => {
    let result = [...allAnnouncements];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.description?.toLowerCase().includes(term)
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const days = parseInt(dateFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((a) => new Date(a.date) >= cutoff);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date_asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [allAnnouncements, searchTerm, sortBy, dateFilter]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!filteredAndSorted.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">Няма намерени новини</Typography>
        <Typography variant="body2">
          Опитайте с различни филтри или ключови думи
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Намерени {filteredAndSorted.length} новини
      </Typography>
      {filteredAndSorted.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
      {hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            startIcon={isFetchingNextPage ? <CircularProgress size={16} /> : <ExpandMoreIcon />}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {isFetchingNextPage ? 'Зареждане...' : 'Зареди още'}
          </Button>
        </Box>
      )}
    </Stack>
  );
});

export default AnnouncementList;