import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Button, Chip, Container, Divider, Paper, Typography } from '@mui/material';
import { Chess } from 'chess.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Link, useParams } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import agent from '../../../lib/api/agent';
import { useAccount } from '../../../lib/hooks/useAccount';
import { usePuzzles } from '../../../lib/hooks/usePuzzles';

// Match your navbar color exactly here
const DARK_SQUARE_COLOR = '#1a3a4a'; // same as navbar — adjust if different
const LIGHT_SQUARE_COLOR = '#e8f4f8';

export default function PuzzleDetails() {
    const { id } = useParams();
    const { puzzle, isLoadingPuzzle } = usePuzzles(id);
    const { currentUser, isAdmin, isTeacher } = useAccount();
    const canEdit = isAdmin || isTeacher;

    const solutionMoves = useMemo(
        () => puzzle?.solution?.split(' ').filter(Boolean) ?? [],
        [puzzle?.solution]
    );

    const game = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState<string | null>(null);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
    const [newRating, setNewRating] = useState<number | null>(null);

    // ── Responsive board width fix ─────────────────────────────────────────
    const boardContainerRef = useRef<HTMLDivElement | null>(null);
    const [boardWidth, setBoardWidth] = useState(480);

    useEffect(() => {
        const el = boardContainerRef.current;
        if (!el) return;
        const update = () => {
            // Subtract any horizontal padding from the Paper (2 * 24px = 48px)
            setBoardWidth(Math.min(el.clientWidth - 2, 560));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // ── Load puzzle ────────────────────────────────────────────────────────
    const loadPuzzle = useCallback(() => {
        if (!puzzle?.fen) return;

        // Load exactly the puzzle position — no setup move
        game.load(puzzle.fen);

        setFen(game.fen());
        setCurrentMoveIndex(0);
        setStatus('playing');
        setNewRating(null);
    }, [puzzle, game]);

    useEffect(() => {
        loadPuzzle();
    }, [loadPuzzle]);

    // ── Handle drop ────────────────────────────────────────────────────────
    const onDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => {
            if (status !== 'playing') return false;

            const expectedMove = solutionMoves[currentMoveIndex];
            if (!expectedMove) return false;

            const expectedBase = expectedMove.substring(0, 4);
            const moveUci = sourceSquare + targetSquare;

            if (moveUci !== expectedBase) {
                setStatus('wrong');
                return false;
            }

            const result = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: expectedMove.length > 4 ? expectedMove[4] : 'q',
            });
            if (!result) return false;

            setFen(game.fen());
            const nextIndex = currentMoveIndex + 1;

            if (nextIndex >= solutionMoves.length) {
                // Puzzle solved — award points
                setStatus('correct');
                if (currentUser && puzzle?.id) {
                    agent.post<number>(`/puzzles/${puzzle.id}/complete`, {})
                        .then(res => setNewRating(res.data))
                        .catch(() => { /* silent fail */ });
                }
            } else {
                setCurrentMoveIndex(nextIndex);
                // Play opponent's response automatically
                setTimeout(() => {
                    const opponentMove = solutionMoves[nextIndex];
                    if (opponentMove?.length >= 4) {
                        game.move({
                            from: opponentMove.substring(0, 2),
                            to: opponentMove.substring(2, 4),
                            promotion: opponentMove.length > 4 ? opponentMove[4] : 'q',
                        });
                        setFen(game.fen());
                        setCurrentMoveIndex(nextIndex + 1);
                    }
                }, 400);
            }

            return true;
        },
        [game, solutionMoves, currentMoveIndex, status, currentUser, puzzle]
    );

    if (isLoadingPuzzle) return <LoadingComponent />;
    if (!puzzle) return <Typography>Задачата не е намерена</Typography>;

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 4, minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, sm: 3, md: 4 } }}>

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
                            to={`/puzzles/${puzzle.id}/edit`}
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

                {/* Board */}
                <Box
                    ref={boardContainerRef}
                    sx={{ width: '100%', maxWidth: 560, mx: 'auto', mb: 3 }}
                >
                    {fen && (
                        <Chessboard
                            id="puzzle-board"
                            position={fen}
                            onPieceDrop={onDrop}
                            boardWidth={boardWidth}
                            boardOrientation={puzzle.whiteToMove ? 'white' : 'black'}
                            arePiecesDraggable={status === 'playing'}
                            customBoardStyle={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            }}
                            customDarkSquareStyle={{ backgroundColor: DARK_SQUARE_COLOR }}
                            customLightSquareStyle={{ backgroundColor: LIGHT_SQUARE_COLOR }}
                            customDropSquareStyle={{
                                boxShadow: 'inset 0 0 1px 5px rgba(255,255,255,0.3)',
                            }}
                            animationDuration={200}
                        />
                    )}
                </Box>

                {/* Status messages */}
                {status === 'correct' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            p: 2,
                            bgcolor: 'success.light',
                            borderRadius: 2,
                            mb: 2,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircleIcon sx={{ color: 'success.dark', fontSize: 32 }} />
                            <Typography variant="h6" fontWeight={700} color="success.dark">
                                Правилно!
                            </Typography>
                        </Box>
                        {newRating !== null && (
                            <Typography variant="body2" color="success.dark">
                                +{puzzle.points} точки • Нов рейтинг: <strong>{newRating}</strong>
                            </Typography>
                        )}
                    </Box>
                )}

                {status === 'wrong' && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 2,
                            bgcolor: 'error.light',
                            borderRadius: 2,
                            mb: 2,
                        }}
                    >
                        <CloseIcon sx={{ color: 'error.dark' }} />
                        <Typography fontWeight={600} color="error.dark">
                            Грешен ход. Опитайте отново.
                        </Typography>
                    </Box>
                )}

                {/* Actions */}
                <Box display="flex" gap={2} justifyContent="center" mt={1}>
                    <Button variant="outlined" onClick={loadPuzzle}>
                        Започни отначало
                    </Button>
                    {status === 'correct' && (
                        <Button component={Link} to="/puzzles" variant="contained">
                            Следваща задача
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}