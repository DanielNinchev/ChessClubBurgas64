import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { Chessboard } from 'react-chessboard';
import { Puzzle, PuzzlePlaylist as Playlist, PuzzleStats } from "../../../lib/types";
import { puzzleStartFen } from '../../../lib/util/puzzleUtils';

const THUMBNAIL_SIZE = 72;

type Props = {
    playlist: Playlist;
    stats: PuzzleStats;
    onSelect: (puzzleNumber: number) => void;
}

// Puzzles must be solved in number order, so anything past the next unsolved one is locked
const isLocked = (puzzle: Puzzle, stats: PuzzleStats) =>
    !puzzle.isCompleted && stats.nextPuzzleNumber !== null && puzzle.number > stats.nextPuzzleNumber;

function PlaylistItem({ puzzle, isCurrent, locked, onSelect }:
    { puzzle: Puzzle, isCurrent: boolean, locked: boolean, onSelect: () => void }) {
    return (
        <ButtonBase
            onClick={onSelect}
            disabled={locked || isCurrent}
            aria-current={isCurrent ? 'true' : undefined}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.25,
                width: '100%',
                p: 1,
                textAlign: 'left',
                borderLeft: 3,
                borderColor: isCurrent ? 'primary.main' : 'transparent',
                bgcolor: isCurrent ? 'rgba(13, 110, 138, 0.12)' : 'transparent',
                opacity: locked ? 0.55 : 1,
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: isCurrent ? 'rgba(13, 110, 138, 0.12)' : 'rgba(13, 110, 138, 0.06)' },
            }}
        >
            {/* Status column, like the index column of a YouTube playlist */}
            <Box width={20} display='flex' justifyContent='center' flexShrink={0}>
                {isCurrent ? <PlayArrowIcon fontSize="small" color="primary" />
                    : locked ? <LockIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    : puzzle.isCompleted ? <CheckCircleIcon fontSize="small" color="success" />
                    : null}
            </Box>

            <Box
                sx={{
                    width: THUMBNAIL_SIZE,
                    height: THUMBNAIL_SIZE,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: 'hidden',
                    filter: locked ? 'grayscale(1)' : 'none',
                    // Thumbnails are static pictures - clicks go to the playlist item
                    pointerEvents: 'none',
                }}
            >
                <Chessboard
                    id={`playlist-${puzzle.id}`}
                    position={puzzleStartFen(puzzle)}
                    boardWidth={THUMBNAIL_SIZE}
                    boardOrientation={puzzle.whiteToMove ? 'white' : 'black'}
                    arePiecesDraggable={false}
                    showBoardNotation={false}
                    animationDuration={0}
                    customDarkSquareStyle={{ backgroundColor: '#094D61' }}
                    customLightSquareStyle={{ backgroundColor: '#e3f2fd' }}
                />
            </Box>

            <Box minWidth={0}>
                <Typography variant="body2" fontWeight={isCurrent ? 700 : 600} noWrap>
                    Задача #{puzzle.number}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap title={puzzle.category}>
                    {puzzle.category}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {puzzle.difficulty}{puzzle.rating ? ` • ${puzzle.rating}` : ''} • {puzzle.points} т.
                </Typography>
            </Box>
        </ButtonBase>
    )
}

export default function PuzzlePlaylist({ playlist, stats, onSelect }: Props) {
    return (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ background: 'linear-gradient(135deg, #094D61 0%, #0D6E8A 100%)', color: 'white', px: 2, py: 1.5 }}>
                <Box display='flex' alignItems='center' gap={1}>
                    <PlaylistPlayIcon />
                    <Typography variant="subtitle1" fontWeight={700}>Задачи по ред</Typography>
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Задача {playlist.currentNumber} / {stats.lastPuzzleNumber} • {stats.completedCount} решени
                </Typography>
            </Box>

            <Stack>
                {playlist.items.map(puzzle => (
                    <PlaylistItem
                        key={puzzle.id}
                        puzzle={puzzle}
                        isCurrent={puzzle.number === playlist.currentNumber}
                        locked={isLocked(puzzle, stats)}
                        onSelect={() => onSelect(puzzle.number)}
                    />
                ))}
            </Stack>
        </Box>
    )
}
