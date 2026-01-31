import { Event, FilterList } from "@mui/icons-material";
import { Box, ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useStore } from "../../../lib/hooks/useStore";

const AnnouncementFilters = observer(function AnnouncementFilters() {
    const { announcementStore: { setFilter, setStartDate, filter, startDate } } = useStore();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6"
                        sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}
                    >
                        <FilterList sx={{ mr: 1 }} />
                        Филтри
                    </Typography>
                    <MenuList>
                        <MenuItem
                            selected={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            <ListItemText primary='Всички новини' />
                        </MenuItem>
                    </MenuList>
                </Box>
            </Paper>
            <Box component={Paper} sx={{ width: '100%', p: 3, borderRadius: 3 }}>
                <Typography variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'primary.main' }}>
                    <Event sx={{ mr: 1 }} />
                    Избери дата
                </Typography>
                <Calendar
                    value={startDate}
                    onChange={date => setStartDate(date as Date)}
                />
            </Box>
        </Box>
    )
})

export default AnnouncementFilters;