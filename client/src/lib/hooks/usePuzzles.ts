import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { Puzzle } from "../types";

type PuzzleFilters = {
    pageNumber?: number;
    pageSize?: number;
    category?: string;
    keyword?: string;
    sort?: string;
    difficulty?: string;
};

type PagedPuzzles = {
    items: Puzzle[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    categories: string[];
};

export const usePuzzles = (id?: string, filters?: PuzzleFilters) => {
    const queryClient = useQueryClient();

    const { data: puzzlesPage, isLoading } = useQuery<PagedPuzzles>({
        queryKey: ['puzzles', filters],
        queryFn: async () => {
            const response = await agent.get<PagedPuzzles>('/puzzles', { params: filters });
            return response.data;
        },
        enabled: !id,
    });

    const { data: puzzle, isLoading: isLoadingPuzzle } = useQuery<Puzzle>({
        queryKey: ['puzzles', id],
        queryFn: async () => {
            const response = await agent.get<Puzzle>(`/puzzles/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const createPuzzle = useMutation({
        mutationFn: async (data: Omit<Puzzle, 'id'>) => {
            const response = await agent.post<string>('/puzzles', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        },
    });

    const updatePuzzle = useMutation({
        mutationFn: async (data: Puzzle) => {
            await agent.put(`/puzzles/${data.id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puzzles'] });
            if (id) queryClient.invalidateQueries({ queryKey: ['puzzles', id] });
        },
    });

    const deletePuzzle = useMutation({
        mutationFn: async (puzzleId: string) => {
            await agent.delete(`/puzzles/${puzzleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        },
    });

    return {
        puzzlesPage,
        isLoading,
        puzzle,
        isLoadingPuzzle,
        createPuzzle,
        updatePuzzle,
        deletePuzzle,
    };
};