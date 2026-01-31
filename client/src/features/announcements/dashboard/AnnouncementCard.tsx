import { AccessTime, Place } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import { Link } from "react-router";
import { formatDate } from "../../../lib/util/util";

type Props = {
  announcement: Announcement
}

export default function AnnouncementCard({ announcement }: Props) {


  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <CardHeader

        />
        <Box display='flex' flexDirection='column' gap={2} mr={2}>

        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <CardContent sx={{ p: 0 }}>
        <Box display='flex' alignItems='center' mb={2} px={2}>
          <Box display='flex' flexGrow={0} alignItems='center'>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap>
              {formatDate(announcement.date)}
            </Typography>
          </Box>

          <Place sx={{ ml: 3, mr: 1 }} />

        </Box>
        <Divider />
        <Box display='flex' gap={2} sx={{ backgroundColor: 'grey.200', py: 3, pl: 3 }}>

        </Box>
      </CardContent>
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="body2">
          {announcement.description}
        </Typography>
        <Button
          component={Link}
          to={`/announcements/${announcement.id}`}
          size="medium"
          variant="contained"
          sx={{ display: 'flex', justifySelf: 'self-end', borderRadius: 3 }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  )
}