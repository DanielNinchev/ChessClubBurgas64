import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Alert, Box, Button, Chip, CircularProgress, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { usePuzzleProgress } from "../../../lib/hooks/usePuzzleProgress";
import PuzzleBoard from "../../puzzles/PuzzleBoard";
import PuzzlePlaylist from "../../puzzles/progress/PuzzlePlaylist";
import PuzzleStatsPanel from "../../puzzles/progress/PuzzleStatsPanel";

export default function ProfilePuzzles() {
    // The puzzle on the board; it changes only when the student picks another one,
    // so refreshed stats after a solve never swap the board under the success message
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const { stats, loadingStats, playlist } = usePuzzleProgress(selectedNumber);
    // Puzzle solved on the board just now - it isn't a "review" even though it is completed afterwards
    const [justSolvedId, setJustSolvedId] = useState<string | null>(null);

    // Start at the next puzzle to solve (or the last one when everything is solved)
    useEffect(() => {
        if (selectedNumber === null && stats) {
            setSelectedNumber(stats.nextPuzzleNumber ?? stats.lastPuzzleNumber);
        }
    }, [selectedNumber, stats]);

    if (loadingStats) return <Box textAlign='center' mt={4}><CircularProgress /></Box>;
    if (!stats || stats.totalPuzzles === 0) {
        return <Typography color="text.secondary" mt={2}>Все още няма добавени задачи.</Typography>;
    }

    const current = playlist?.items.find(p => p.number === playlist.currentNumber);
    const isReview = !!current && current.isCompleted && current.id !== justSolvedId;
    const goToNext = () => stats.nextPuzzleNumber !== null && setSelectedNumber(stats.nextPuzzleNumber);

    return (
        <Grid2 container spacing={3}>
            {/* Order on small screens: board, playlist, stats */}
            <Grid2 size={{ xs: 12, lg: 3 }} sx={{ order: { xs: 3, lg: 1 } }}>
                <PuzzleStatsPanel stats={stats} />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 7, lg: 6 }} sx={{ order: { xs: 1, lg: 2 } }}>
                {current ? (
                    <>
                        <Box mb={2}>
                            <Typography variant="h5" fontWeight={700}>Задача #{current.number}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>{current.description}</Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip label={current.category} color="primary" size="small" />
                                <Chip label={current.difficulty} variant="outlined" size="small" />
                                {current.rating && <Chip label={`Рейтинг ${current.rating}`} variant="outlined" size="small" />}
                                <Chip icon={<EmojiEventsIcon />} label={`${current.points} т.`} variant="outlined" color="success" size="small" />
                            </Box>
                        </Box>

                        {stats.nextPuzzleNumber === null && (
                            <Alert severity="success" sx={{ mb: 2 }}>Браво! Решихте всички задачи.</Alert>
                        )}
                        {isReview && stats.nextPuzzleNumber !== null && (
                            <Alert
                                severity="info"
                                sx={{ mb: 2 }}
                                action={<Button color="inherit" size="small" onClick={goToNext}>Към #{stats.nextPuzzleNumber}</Button>}
                            >
                                Преглед на решена задача - точките се получават само веднъж.
                            </Alert>
                        )}

                        <PuzzleBoard
                            key={current.id}
                            puzzle={current}
                            onCompleted={result => result.pointsAwarded && setJustSolvedId(current.id)}
                            solvedActions={result => result?.nextPuzzleNumber != null && (
                                <Button variant="contained" onClick={() => setSelectedNumber(result.nextPuzzleNumber)}>
                                    Следваща задача
                                </Button>
                            )}
                        />
                    </>
                ) : (
                    <Box textAlign='center' mt={4}><CircularProgress /></Box>
                )}
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5, lg: 3 }} sx={{ order: { xs: 2, lg: 3 } }}>
                {playlist && <PuzzlePlaylist playlist={playlist} stats={stats} onSelect={setSelectedNumber} />}
            </Grid2>
        </Grid2>
    )
}
