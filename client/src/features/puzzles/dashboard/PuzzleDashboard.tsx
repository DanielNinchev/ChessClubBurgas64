import ExtensionIcon from '@mui/icons-material/Extension';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Typography
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Chessboard } from 'react-chessboard';
import { Link } from 'react-router';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';
import { useStore } from '../../../lib/hooks/useStore';
import { Puzzle } from "../../../lib/types";

const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
    'Лесна': 'success',
    'Средна': 'warning',
    'Трудна': 'error',
};

export default observer(function PuzzleDashboard() {
    const { puzzleStore } = useStore();
    const { puzzlesGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = usePuzzles();

    return (
        <Container maxWidth="lg" sx={{ pt: 12, pb: 6, minHeight: '100vh' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <ExtensionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="primary.dark">
                    Шахматни задачи
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Решавайте задачи и подобрявайте уменията си
                </Typography>
            </Box>

            {/* Filter */}
            <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Трудност</InputLabel>
                    <Select
                        value={puzzleStore.difficulty}
                        label="Трудност"
                        onChange={(e) => puzzleStore.setDifficulty(e.target.value)}
                    >
                        <MenuItem value="">Всички</MenuItem>
                        <MenuItem value="Лесна">Лесна</MenuItem>
                        <MenuItem value="Средна">Средна</MenuItem>
                        <MenuItem value="Трудна">Трудна</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Puzzles Grid */}
            <Grid2 container spacing={3}>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <Skeleton variant="rounded" height={350} sx={{ borderRadius: 3 }} />
                        </Grid2>
                    ))
                    : puzzlesGroup?.pages.map((page) =>
                        page.items.map((puzzle: Puzzle) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={puzzle.id}>
                                <Card
                                    component={Link}
                                    to={`/puzzles/${puzzle.id}`}
                                    sx={{
                                        borderRadius: 3,
                                        textDecoration: 'none',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                >
                                    <Box sx={{ p: 1.5, bgcolor: 'grey.50' }}>
                                        <Chessboard
                                            position={puzzle.fen}
                                            boardWidth={280}
                                            arePiecesDraggable={false}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="h6" fontWeight={600} noWrap>
                                                {puzzle.title}
                                            </Typography>
                                            <Chip
                                                label={puzzle.difficulty}
                                                color={difficultyColors[puzzle.difficulty] || 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {puzzle.description}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            {new Date(puzzle.date).toLocaleDateString('bg-BG')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))
                    )}
            </Grid2>

            {/* Load more */}
            {hasNextPage && (
                <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="outlined"
                        size="large"
                        sx={{ px: 6, fontWeight: 600 }}
                    >
                        {isFetchingNextPage ? 'Зареждане...' : 'Зареди още'}
                    </Button>
                </Box>
            )}
        </Container>
    );
});