import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../lib/hooks/useStore';

const dateFilters = [
    { label: 'Всички', value: 'all' },
    { label: 'Последните 7 дни', value: '7' },
    { label: 'Последните 14 дни', value: '14' },
    { label: 'Последните 30 дни', value: '30' },
    { label: 'Последните 90 дни', value: '90' },
    { label: 'Последната година', value: '365' },
];

const sortOptions = [
    { label: 'Най-нови първо', value: 'date_desc' },
    { label: 'Най-стари първо', value: 'date_asc' },
];

export default observer(function AnnouncementSidebar() {
    const { announcementStore } = useStore();
    const { searchTerm, setSearchTerm, sortBy, setSortBy, dateFilter, setDateFilter } = announcementStore;

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value);
    };

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value === dateFilter ? 'all' : value);
    };

    return (
        <Stack spacing={3}>
            {/* Search */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SearchIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" color="primary.dark">
                            Търсене
                        </Typography>
                    </Box>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Търсене по ключова дума..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                </CardContent>
            </Card>

            {/* Sort */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SortIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" color="primary.dark">
                            Сортиране
                        </Typography>
                    </Box>
                    <FormControl fullWidth size="small">
                        <InputLabel>Подреди по</InputLabel>
                        <Select
                            value={sortBy}
                            label="Подреди по"
                            onChange={handleSortChange}
                            sx={{ borderRadius: 2 }}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Filter by Date */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <FilterListIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" color="primary.dark">
                            Филтриране по дата
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {dateFilters.map((filter) => (
                            <Chip
                                key={filter.value}
                                label={filter.label}
                                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                                onClick={() => handleDateFilterChange(filter.value)}
                                color={dateFilter === filter.value ? 'primary' : 'default'}
                                variant={dateFilter === filter.value ? 'filled' : 'outlined'}
                                sx={{
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor:
                                            dateFilter === filter.value
                                                ? 'primary.dark'
                                                : 'rgba(13, 110, 138, 0.08)',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Quick Info / Ad space */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, #094D61 0%, #0D6E8A 40%, #1BA3C6 100%)',
                    color: 'white',
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        🏆 Шахматен Клуб Бургас 64
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                        Присъединете се към нашия клуб и станете част от шахматната общност
                        в Бургас! Провеждаме редовни тренировки и турнири.
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
});