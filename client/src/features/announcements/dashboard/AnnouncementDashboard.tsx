import { Grid2 } from "@mui/material";
import AnnouncementFilters from "./AnnouncementFilters";
import AnnouncementList from "./AnnouncementList";

export default function AnnouncementDashboard() {
    return (
        <Grid2 container spacing={3}>
            <Grid2 size={8}>
                <AnnouncementList />
            </Grid2>
            <Grid2
                size={4}
                sx={{
                    position: 'sticky',
                    top: 112,
                    alignSelf: 'flex-start'
                }}
            >
                <AnnouncementFilters />
            </Grid2>
        </Grid2>
    )
}