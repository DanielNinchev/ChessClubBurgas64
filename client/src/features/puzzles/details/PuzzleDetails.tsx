import EditIcon from '@mui/icons-material/Edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Button, Chip, Container, Divider, Paper, Typography } from '@mui/material';
import { Link, useParams } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useAccount } from '../../../lib/hooks/useAccount';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';
import PuzzleBoard from '../PuzzleBoard';

export default function PuzzleDetails() {
    const { id } = useParams();
    const { puzzle, isLoadingPuzzle } = usePuzzles(id);
    const { isAdmin, isTeacher } = useAccount();
    const canEdit = isAdmin || isTeacher;

    if (isLoadingPuzzle) return <LoadingComponent />;
    if (!puzzle) return <Typography>Задачата не е намерена</Typography>;

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            {/* No backdrop-filter here: it would become the containing block for the board's
                position:fixed drag preview and throw dragged pieces off the board */}
            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, sm: 3, md: 4 }, backdropFilter: 'none' }}>

                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Задача #{puzzle.number}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {puzzle.description}
                        </Typography>
                    </Box>
                    {canEdit && (
                        <Button
                            component={Link}
                            to={`/puzzles/update/${puzzle.id}`}
                            startIcon={<EditIcon />}
                            variant="outlined"
                            size="small"
                        >
                            Редактирай
                        </Button>
                    )}
                </Box>

                {/* Chips */}
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                    <Chip label={puzzle.category} color="primary" size="small" />
                    <Chip label={puzzle.difficulty} variant="outlined" size="small" />
                    {puzzle.rating && (
                        <Chip label={`Рейтинг ${puzzle.rating}`} variant="outlined" size="small" />
                    )}
                    <Chip
                        icon={<EmojiEventsIcon />}
                        label={`${puzzle.points} т.`}
                        variant="outlined"
                        color="success"
                        size="small"
                    />
                    <Chip
                        label={puzzle.whiteToMove ? '⬜ Белите на ход' : '⬛ Черните на ход'}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <PuzzleBoard
                    puzzle={puzzle}
                    solvedActions={() => (
                        <Button component={Link} to="/puzzles" variant="contained">
                            Следваща задача
                        </Button>
                    )}
                />
            </Paper>
        </Container>
    );
}
