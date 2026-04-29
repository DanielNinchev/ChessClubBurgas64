import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Card, Chip, Typography } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import { Link } from 'react-router';
import { Puzzle } from '../../../lib/types';

type Props = { puzzle: Puzzle };

const BOARD_SIZE = 240;

export default function PuzzleCard({ puzzle }: Props) {
    return (
        <Card
            component={Link}
            to={`/puzzles/${puzzle.id}`}
            sx={{
                textDecoration: 'none',
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                opacity: puzzle.isCompleted ? 0.6 : 1,
                outline: puzzle.isCompleted ? '2px solid #2e7d32' : 'none',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    opacity: 1,
                },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Board centered */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'grey.100',
                    pt: 2,
                    px: 2,
                    position: 'relative',
                }}
            >
                {puzzle.isCompleted && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            bgcolor: 'success.main',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TaskAltIcon sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                )}
                <Box sx={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
                    <Chessboard
                        id={`card-${puzzle.id}`}
                        position={puzzle.fen}
                        arePiecesDraggable={false}
                        boardOrientation={puzzle.whiteToMove ? 'white' : 'black'}
                        boardWidth={BOARD_SIZE}
                        customBoardStyle={{ borderRadius: '6px' }}
                        customDarkSquareStyle={{ backgroundColor: '#094D61' }}
                        customLightSquareStyle={{ backgroundColor: '#e3f2fd' }}
                    />
                </Box>
            </Box>

            {/* Info */}
            <Box sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Задача #{puzzle.number}
                    </Typography>
                    {puzzle.isCompleted && (
                        <Typography variant="caption" color="success.main" fontWeight={700}>
                            ✅ Решена
                        </Typography>
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {puzzle.description}
                </Typography>

                <Box display="flex" gap={0.5} flexWrap="wrap">
                    <Chip label={puzzle.category} color="primary" size="small" />
                    <Chip label={puzzle.difficulty} variant="outlined" size="small" />
                    <Chip
                        icon={<EmojiEventsIcon />}
                        label={`${puzzle.points} т.`}
                        variant="outlined"
                        color="success"
                        size="small"
                    />
                </Box>
            </Box>
        </Card>
    );
}