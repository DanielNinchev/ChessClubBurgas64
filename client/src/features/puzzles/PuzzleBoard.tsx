import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Chess } from 'chess.js';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import agent from '../../lib/api/agent';
import { useAccount } from '../../lib/hooks/useAccount';
import { CompletePuzzleResult, Puzzle } from '../../lib/types';

// Match your navbar color exactly here
const DARK_SQUARE_COLOR = '#1a3a4a'; // same as navbar — adjust if different
const LIGHT_SQUARE_COLOR = '#e8f4f8';

const LAST_MOVE_STYLE = { backgroundColor: 'rgba(255, 213, 79, 0.55)' };
const OPPONENT_DELAY_MS = 600;

type LastMove = { from: string; to: string } | null;

type Props = {
    puzzle: Puzzle;
    // Extra buttons shown next to "Започни отначало" once the puzzle is solved
    solvedActions?: (result: CompletePuzzleResult | null) => ReactNode;
    onCompleted?: (result: CompletePuzzleResult) => void;
}

/**
 * Interactive puzzle board: plays the opponent's setup move, checks the solver's moves,
 * answers with the opponent's replies and reports the solve to the API.
 *
 * NOTE: no ancestor of this component may use `backdrop-filter` or `transform` (e.g. the theme's Paper):
 * those become the containing block of the board's position:fixed drag preview and throw dragged pieces off the board.
 */
export default function PuzzleBoard({ puzzle, solvedActions, onCompleted }: Props) {
    const { currentUser } = useAccount();
    const queryClient = useQueryClient();

    // Primitive fields only: a refetched puzzle (e.g. isCompleted flipping to true) must not reset the board
    const { id, fen: puzzleFen, previousMove, solution, whiteToMove, points } = puzzle;

    const solutionMoves = useMemo(() => solution?.split(' ').filter(Boolean) ?? [], [solution]);

    const game = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState<string | null>(null);
    const [lastMove, setLastMove] = useState<LastMove>(null);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    // 'waiting' = the opponent's move is being played; the solver can't move yet.
    // 'invalid' = the stored position can't be solved (e.g. it isn't the solver's turn)
    const [status, setStatus] = useState<'waiting' | 'playing' | 'solved' | 'invalid'>('waiting');
    // Feedback for the last rejected move: a legal but wrong move, or a move the rules don't allow
    const [rejectedMove, setRejectedMove] = useState<'wrong' | 'illegal' | null>(null);
    const [result, setResult] = useState<CompletePuzzleResult | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Responsive board width ─────────────────────────────────────────────
    const boardContainerRef = useRef<HTMLDivElement | null>(null);
    const [boardWidth, setBoardWidth] = useState(480);

    useEffect(() => {
        const el = boardContainerRef.current;
        if (!el) return;
        const update = () => setBoardWidth(Math.min(el.clientWidth - 2, 560));
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Plays a UCI move (e.g. "e2e4", "e7e8q") on the internal game; returns false if illegal
    const playUci = useCallback((uci: string) => {
        try {
            game.move({
                from: uci.substring(0, 2),
                to: uci.substring(2, 4),
                promotion: uci.length > 4 ? uci[4] : undefined,
            });
        } catch {
            return false; // chess.js v1 throws on illegal moves
        }
        setFen(game.fen());
        setLastMove({ from: uci.substring(0, 2), to: uci.substring(2, 4) });
        return true;
    }, [game]);

    const playOpponentMove = useCallback((uci: string, onDone: () => void) => {
        setStatus('waiting');
        timeoutRef.current = setTimeout(() => {
            playUci(uci);
            onDone();
        }, OPPONENT_DELAY_MS);
    }, [playUci]);

    // ── Load puzzle ────────────────────────────────────────────────────────
    const loadPuzzle = useCallback(() => {
        if (!puzzleFen) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        try {
            game.load(puzzleFen);
        } catch {
            return;
        }

        setFen(game.fen());
        setLastMove(null);
        setCurrentMoveIndex(0);
        setRejectedMove(null);
        setResult(null);

        // Check up front that the setup move is legal and leaves the solver to move - otherwise every
        // move would be rejected without explanation
        const probe = new Chess(puzzleFen);
        if (previousMove) {
            try {
                probe.move({ from: previousMove.substring(0, 2), to: previousMove.substring(2, 4), promotion: previousMove[4] });
            } catch {
                setStatus('invalid');
                return;
            }
        }
        if (probe.turn() !== (whiteToMove ? 'w' : 'b')) {
            setStatus('invalid');
            return;
        }

        // Lichess puzzles start one move early: the opponent's move sets the puzzle up
        if (previousMove) {
            playOpponentMove(previousMove, () => setStatus('playing'));
        } else {
            setStatus('playing');
        }
    }, [puzzleFen, previousMove, whiteToMove, game, playOpponentMove]);

    useEffect(() => {
        loadPuzzle();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [loadPuzzle]);

    const completePuzzle = useCallback(() => {
        setStatus('solved');
        if (!currentUser) return;
        agent.post<CompletePuzzleResult>(`/puzzles/${id}/complete`, {})
            .then(res => {
                setResult(res.data);
                onCompleted?.(res.data);
                queryClient.invalidateQueries({ queryKey: ['puzzles'] });
                queryClient.invalidateQueries({ queryKey: ['puzzle-progress'] });
            })
            .catch(() => { /* silent fail */ });
    }, [currentUser, id, queryClient, onCompleted]);

    // ── Handle the solver's move (drag & drop or promotion dialog) ─────────
    const tryMove = useCallback(
        (from: string, to: string, promotion?: string) => {
            if (status !== 'playing') return false;

            const expectedMove = solutionMoves[currentMoveIndex];
            if (!expectedMove) return false;

            const uci = from + to + (promotion ?? '');
            const isExpected = uci === expectedMove;

            if (!isExpected) {
                // Any mating move also solves the puzzle, like on Lichess
                const probe = new Chess(game.fen());
                let mates = false;
                try {
                    probe.move({ from, to, promotion });
                    mates = probe.isCheckmate();
                } catch {
                    setRejectedMove('illegal');
                    return false;
                }
                if (!mates) {
                    setRejectedMove('wrong');
                    return false;
                }
            }

            if (!playUci(uci)) return false;
            setRejectedMove(null);

            const nextIndex = currentMoveIndex + 1;
            if (!isExpected || nextIndex >= solutionMoves.length) {
                completePuzzle();
            } else {
                playOpponentMove(solutionMoves[nextIndex], () => {
                    setCurrentMoveIndex(nextIndex + 1);
                    if (nextIndex + 1 >= solutionMoves.length) completePuzzle();
                    else setStatus('playing');
                });
            }
            return true;
        },
        [game, solutionMoves, currentMoveIndex, status, playUci, playOpponentMove, completePuzzle]
    );

    const onDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => tryMove(sourceSquare, targetSquare),
        [tryMove]
    );

    // Promotions skip onPieceDrop: the board shows its dialog and reports the choice here (e.g. "wQ")
    const onPromotionPieceSelect = useCallback(
        (piece?: string, from?: string, to?: string) =>
            !!piece && !!from && !!to && tryMove(from, to, piece[1].toLowerCase()),
        [tryMove]
    );

    const canRestart = status === 'solved' || (status === 'playing' && (currentMoveIndex > 0 || rejectedMove !== null));

    const squareStyles = lastMove
        ? { [lastMove.from]: LAST_MOVE_STYLE, [lastMove.to]: LAST_MOVE_STYLE }
        : {};

    const solvedMessage = () => {
        if (!currentUser) return 'Влезте в профила си, за да получавате точки за решените задачи.';
        if (!result) return null;
        if (result.pointsAwarded) return <>+{points} точки • Общо точки: <strong>{result.rating}</strong></>;
        if (result.alreadyCompleted) return 'Вече сте решили тази задача - точките се получават само веднъж.';
        return `Задачата не е зачетена: задачите се решават по ред. Следващата ви задача е #${result.nextPuzzleNumber}.`;
    };

    return (
        <Box>
            {/* Board */}
            <Box ref={boardContainerRef} sx={{ width: '100%', maxWidth: 560, mx: 'auto', mb: 3 }}>
                {fen && (
                    <Chessboard
                        id="puzzle-board"
                        position={fen}
                        onPieceDrop={onDrop}
                        onPromotionPieceSelect={onPromotionPieceSelect}
                        customSquareStyles={squareStyles}
                        boardWidth={boardWidth}
                        boardOrientation={whiteToMove ? 'white' : 'black'}
                        arePiecesDraggable={status === 'playing'}
                        isDraggablePiece={({ piece }) => piece[0] === (whiteToMove ? 'w' : 'b')}
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
            {status === 'solved' && (
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
                        textAlign: 'center',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon sx={{ color: 'success.dark', fontSize: 32 }} />
                        <Typography variant="h6" fontWeight={700} color="success.dark">
                            Правилно!
                        </Typography>
                    </Box>
                    {solvedMessage() && (
                        <Typography variant="body2" color="success.dark">
                            {solvedMessage()}
                        </Typography>
                    )}
                </Box>
            )}

            {status === 'invalid' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Позицията на тази задача е невалидна и тя не може да бъде решена. Моля, уведомете треньора.
                </Alert>
            )}

            {rejectedMove && status === 'playing' && (
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
                        {rejectedMove === 'wrong' ? 'Грешен ход. Опитайте отново.' : 'Този ход не е позволен по правилата.'}
                    </Typography>
                </Box>
            )}

            {/* Actions */}
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mt={1}>
                {/* Only useful once the student has played something */}
                <Button variant="outlined" onClick={loadPuzzle} disabled={!canRestart}>
                    Започни отначало
                </Button>
                {status === 'solved' && solvedActions?.(result)}
            </Box>
        </Box>
    );
}
