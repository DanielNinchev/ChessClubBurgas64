import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Typography,
} from '@mui/material';
import { Chess, Square } from 'chess.js';
import { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Link, useNavigate, useParams } from 'react-router';
import { useAccount } from '../../../lib/hooks/useAccount';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';

const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
    'Лесна': 'success',
    'Средна': 'warning',
    'Трудна': 'error',
};

export default function PuzzleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { puzzle, deletePuzzle } = usePuzzles(id);
    const { currentUser, isAdmin } = useAccount();
    const [solved, setSolved] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const game = useMemo(() => {
        if (!puzzle) return new Chess();
        return new Chess(puzzle.fen);
    }, [puzzle]);

    const [currentFen, setCurrentFen] = useState(puzzle?.fen || '');

    // Reset when puzzle loads
    useMemo(() => {
        if (puzzle) setCurrentFen(puzzle.fen);
    }, [puzzle]);

    const solutionMoves = useMemo(() => {
        if (!puzzle) return [];
        return puzzle.solution.split(' ').filter(m => m.length > 0);
    }, [puzzle]);

    const [moveIndex, setMoveIndex] = useState(0);

    const onDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
        if (solved || failed) return false;

        const expectedMove = solutionMoves[moveIndex];
        const moveStr = sourceSquare + targetSquare;

        // Check if the move matches expected
        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (!move) return false;

            const moveNotation = move.from + move.to;

            if (moveNotation === expectedMove || move.san === expectedMove) {
                setCurrentFen(game.fen());
                const nextIndex = moveIndex + 1;
                setMoveIndex(nextIndex);

                if (nextIndex >= solutionMoves.length) {
                    setSolved(true);
                } else {
                    // Play opponent's response after a delay
                    setTimeout(() => {
                        const opponentMove = solutionMoves[nextIndex];
                        if (opponentMove) {
                            try {
                                game.move(opponentMove);
                                setCurrentFen(game.fen());
                                setMoveIndex(nextIndex + 1);

                                if (nextIndex + 1 >= solutionMoves.length) {
                                    setSolved(true);
                                }
                            } catch {
                                // invalid opponent move
                            }
                        }
                    }, 500);
                }

                return true;
            } else {
                game.undo();
                setFailed(true);
                return false;
            }
        } catch {
            return false;
        }
    }, [game, moveIndex, solutionMoves, solved, failed]);

    const handleReset = () => {
        if (!puzzle) return;
        const newGame = new Chess(puzzle.fen);
        Object.assign(game, newGame);
        setCurrentFen(puzzle.fen);
        setMoveIndex(0);
        setSolved(false);
        setFailed(false);
        setShowSolution(false);
    };

    const handleDelete = () => {
        if (puzzle && window.confirm('Сигурни ли сте, че искате да изтриете тази задача?')) {
            deletePuzzle.mutate(puzzle.id, {
                onSuccess: () => navigate('/puzzles'),
            });
        }
    };

    if (!puzzle) return null;

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 6, minHeight: '100vh' }}>
            <Button
                component={Link}
                to="/puzzles"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
            >
                Към всички задачи
            </Button>

            <Paper elevation={3} sx={{ borderRadius: 3, p: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="primary.dark">
                            {puzzle.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                            <Chip
                                label={puzzle.difficulty}
                                color={difficultyColors[puzzle.difficulty] || 'default'}
                                size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(puzzle.date).toLocaleDateString('bg-BG')}
                            </Typography>
                        </Box>
                    </Box>

                    {isAdmin && (
                        <Box display="flex" gap={1}>
                            <Button
                                component={Link}
                                to={`/puzzles/update/${puzzle.id}`}
                                startIcon={<EditIcon />}
                                variant="outlined"
                                size="small"
                            >
                                Редактирай
                            </Button>
                            <Button
                                onClick={handleDelete}
                                startIcon={<DeleteIcon />}
                                variant="outlined"
                                color="error"
                                size="small"
                                disabled={deletePuzzle.isPending}
                            >
                                Изтрий
                            </Button>
                        </Box>
                    )}
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {puzzle.description}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Chessboard */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Chessboard
                        position={currentFen}
                        onPieceDrop={onDrop}
                        boardWidth={480}
                        arePiecesDraggable={!solved && !failed}
                    />

                    {/* Status */}
                    {solved && (
                        <Box display="flex" alignItems="center" gap={1} sx={{
                            bgcolor: 'success.light', color: 'success.dark',
                            px: 3, py: 1.5, borderRadius: 2,
                        }}>
                            <CheckCircleIcon />
                            <Typography fontWeight={600}>Браво! Решихте задачата!</Typography>
                        </Box>
                    )}

                    {failed && (
                        <Box display="flex" alignItems="center" gap={1} sx={{
                            bgcolor: 'error.light', color: 'error.dark',
                            px: 3, py: 1.5, borderRadius: 2,
                        }}>
                            <CancelIcon />
                            <Typography fontWeight={600}>Грешен ход! Опитайте отново.</Typography>
                        </Box>
                    )}

                    {/* Controls */}
                    <Box display="flex" gap={2}>
                        <Button
                            onClick={handleReset}
                            startIcon={<RestartAltIcon />}
                            variant="outlined"
                        >
                            Започни отначало
                        </Button>
                        <Button
                            onClick={() => setShowSolution(!showSolution)}
                            startIcon={<VisibilityIcon />}
                            variant="outlined"
                            color="secondary"
                        >
                            {showSolution ? 'Скрий решението' : 'Покажи решението'}
                        </Button>
                    </Box>

                    {showSolution && (
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', width: '100%' }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Решение:
                            </Typography>
                            <Typography variant="body1" fontFamily="monospace" fontWeight={600}>
                                {puzzle.solution}
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}