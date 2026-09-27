import { keepPreviousData, useQuery } from "@tanstack/react-query";
import agent from "../api/agent";
import { PuzzlePlaylist, PuzzleStats } from "../types";

// Keys live under 'puzzle-progress' so PuzzleBoard can refresh them all after a solve
export const usePuzzleProgress = (around: number | null) => {
    const { data: stats, isLoading: loadingStats } = useQuery<PuzzleStats>({
        queryKey: ['puzzle-progress', 'stats'],
        queryFn: async () => {
            const response = await agent.get<PuzzleStats>('/puzzles/stats');
            return response.data;
        },
    });

    const { data: playlist, isLoading: loadingPlaylist } = useQuery<PuzzlePlaylist>({
        queryKey: ['puzzle-progress', 'playlist', around],
        queryFn: async () => {
            const response = await agent.get<PuzzlePlaylist>('/puzzles/playlist', { params: { around } });
            return response.data;
        },
        enabled: around !== null,
        // Keep showing the old column while the next window loads
        placeholderData: keepPreviousData,
    });

    return { stats, loadingStats, playlist, loadingPlaylist };
};
