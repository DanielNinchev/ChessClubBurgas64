import { Box, Typography } from "@mui/material";
import AnnouncementCard from "./AnnouncementCard";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const ActivityList = observer(function AnnouncementList() {
  const { activitiesGroup, isLoading, hasNextPage, fetchNextPage } = useAnnouncements();
  const {ref, inView} = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (isLoading) return <Typography>Зареждане...</Typography>

  if (!activitiesGroup) return <Typography>Няма открити новини</Typography>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {activitiesGroup.pages.map((activities, index) => (
        <Box 
          key={index}
          ref={index === activitiesGroup.pages.length - 1 ? ref : null}
          display='flex'
          flexDirection='column'
          gap={3}
        >
          {activities.items.map(activity => (
            <AnnouncementCard
              key={activity.id}
              activity={activity}
            />
          ))}
        </Box>
      ))}

    </Box>
  )
});

export default ActivityList;