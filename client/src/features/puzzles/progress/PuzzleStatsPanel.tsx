import InsightsIcon from '@mui/icons-material/Insights';
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { PuzzleStatGroup, PuzzleStats } from "../../../lib/types";

const percent = (completed: number, total: number) => total ? Math.round((completed / total) * 100) : 0;

function StatTile({ label, value }: { label: string, value: string | number }) {
    return (
        <Box flex={1} textAlign='center' p={1} borderRadius={2} bgcolor='rgba(13, 110, 138, 0.08)'>
            <Typography variant="h6" color="primary.dark" lineHeight={1.2}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    )
}

function StatGroup({ title, groups, scroll }: { title: string, groups: PuzzleStatGroup[], scroll?: boolean }) {
    return (
        <Box>
            <Typography variant="subtitle2" color="primary.dark" mb={1}>{title}</Typography>
            <Stack gap={1} sx={scroll ? { maxHeight: 240, overflowY: 'auto', pr: 1 } : undefined}>
                {groups.map(group => (
                    <Box key={group.name}>
                        <Box display='flex' justifyContent='space-between' gap={1}>
                            <Typography variant="body2" noWrap title={group.name}>{group.name}</Typography>
                            <Typography variant="body2" color="text.secondary" flexShrink={0}>
                                {group.completed} / {group.total}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={percent(group.completed, group.total)}
                            sx={{ height: 6, borderRadius: 3 }}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}

export default function PuzzleStatsPanel({ stats }: { stats: PuzzleStats }) {
    const donePercent = percent(stats.completedCount, stats.totalPuzzles);

    return (
        <Stack gap={2.5} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2 }}>
            <Box display='flex' alignItems='center' gap={1} color='primary.main'>
                <InsightsIcon />
                <Typography variant="h6">Моята статистика</Typography>
            </Box>

            <Box>
                <Box display='flex' alignItems='baseline' gap={1}>
                    <Typography variant="h4" color="primary.dark">{stats.completedCount}</Typography>
                    <Typography variant="body1" color="text.secondary">/ {stats.totalPuzzles} решени</Typography>
                </Box>
                <LinearProgress variant="determinate" value={donePercent} sx={{ height: 10, borderRadius: 5, my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                    {stats.nextPuzzleNumber === null
                        ? 'Решихте всички задачи!'
                        : `${donePercent}% • следваща задача: #${stats.nextPuzzleNumber}`}
                </Typography>
            </Box>

            <Box display='flex' gap={1}>
                <StatTile label="Точки" value={stats.pointsEarned} />
                <StatTile label="Ср. рейтинг" value={stats.averageRating ?? '-'} />
                <StatTile label="Най-висок" value={stats.highestRating ?? '-'} />
            </Box>

            <StatGroup title="По трудност" groups={stats.byDifficulty} />
            <StatGroup title="По рейтинг на задачата" groups={stats.byRating} />
            <StatGroup title="По категория" groups={stats.byCategory} scroll />
        </Stack>
    )
}
