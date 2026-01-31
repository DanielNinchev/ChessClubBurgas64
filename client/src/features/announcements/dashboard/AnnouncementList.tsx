import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import AnnouncementCard from "./AnnouncementCard";

const AnnouncementList = observer(function AnnouncementList() {
  const { announcementsGroup, isLoading, hasNextPage, fetchNextPage } = useAnnouncements();
  const { ref, inView } = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (isLoading) return <Typography>Зареждане...</Typography>

  if (!announcementsGroup) return <Typography>Няма открити новини</Typography>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {announcementsGroup.pages.map((announcements, index) => (
        <Box
          key={index}
          ref={index === announcementsGroup.pages.length - 1 ? ref : null}
          display='flex'
          flexDirection='column'
          gap={3}
        >
          {announcements.items.map(Announcement => (
            <AnnouncementCard
              key={Announcement.id}
              announcement={Announcement}
            />
          ))}
        </Box>
      ))}

    </Box>
  )
});

export default AnnouncementList;