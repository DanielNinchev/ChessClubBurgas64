import AddIcon from '@mui/icons-material/Add';
import ExtensionIcon from '@mui/icons-material/Extension';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box, Button, Container, FormControl, Grid2 as Grid,
    InputAdornment, InputLabel, MenuItem, Pagination,
    Select, TextField, Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useAccount } from '../../../lib/hooks/useAccount';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';
import PuzzleCard from './PuzzleCard';

const PAGE_SIZE = 9;

export default function PuzzleDashboard() {
    const [pageNumber, setPageNumber] = useState(1);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState('number');

    const filters = useMemo(
        () => ({
            pageNumber,
            pageSize: PAGE_SIZE,
            category: category || undefined,
            keyword: keyword || undefined,
            sort,
        }),
        [pageNumber, category, keyword, sort]
    );

    const { puzzlesPage, isLoading } = usePuzzles(undefined, filters);
    const { isAdmin, isTeacher } = useAccount();
    const canCreate = isAdmin || isTeacher;

    const items = puzzlesPage?.items ?? [];
    const totalPages = puzzlesPage?.totalPages ?? 1;
    const categories = puzzlesPage?.categories ?? [];

    const resetPage = () => setPageNumber(1);

    return (
        <Container maxWidth="lg" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>

            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <ExtensionIcon fontSize="large" color="primary" />
                    <Typography variant="h4" fontWeight={700}>Шахматни задачи</Typography>
                </Box>
                {canCreate && (
                    <Button
                        component={Link}
                        to="/puzzles/create"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Нова задача
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
                mb={3}
                sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}
            >
                <TextField
                    label="Търсене"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); resetPage(); }}
                    size="small"
                    sx={{ flex: '1 1 220px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={category}
                        label="Категория"
                        onChange={(e) => { setCategory(e.target.value); resetPage(); }}
                    >
                        <MenuItem value="">Всички</MenuItem>
                        {categories.map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Сортиране</InputLabel>
                    <Select
                        value={sort}
                        label="Сортиране"
                        onChange={(e) => { setSort(e.target.value); resetPage(); }}
                    >
                        <MenuItem value="number">По номер</MenuItem>
                        <MenuItem value="category">По категория</MenuItem>
                        <MenuItem value="points-asc">Точки ↑</MenuItem>
                        <MenuItem value="points-desc">Точки ↓</MenuItem>
                        <MenuItem value="difficulty">По трудност</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Grid */}
            {isLoading ? (
                <LoadingComponent />
            ) : items.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <ExtensionIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Няма намерени задачи
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {items.map((puzzle) => (
                            <Grid key={puzzle.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <PuzzleCard puzzle={puzzle} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={pageNumber}
                                onChange={(_, page) => setPageNumber(page)}
                                color="primary"
                                showFirstButton
                                showLastButton
                                siblingCount={1}
                                boundaryCount={1}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}