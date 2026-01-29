import { Grid2, Typography } from "@mui/material"
import { useParams } from "react-router";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import AnnouncementDetailsHeader from "./AnnouncementDetailsHeader";
import AnnouncementDetailsInfo from "./AnnouncementDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import AnnouncementDetailsSidebar from "./AnnouncementDetailsSidebar";

export default function AnnouncementDetailsPage() {
    const {id} = useParams();
    const {activity, isLoadingActivity} = useAnnouncements(id);

    if (isLoadingActivity) return <Typography>Loading...</Typography>

    if (!activity) return <Typography>Activity not found</Typography>

    return (
        <Grid2 container spacing={3}>
            <Grid2 size={8}>
                <AnnouncementDetailsHeader activity={activity} />
                <AnnouncementDetailsInfo activity={activity} />
                <ActivityDetailsChat />
            </Grid2>
            <Grid2 size={4}>
                <AnnouncementDetailsSidebar activity={activity} />
            </Grid2>
        </Grid2>
    )
}