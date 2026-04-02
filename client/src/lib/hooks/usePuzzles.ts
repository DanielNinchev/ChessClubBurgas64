import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { useLocation } from "react-router";
import agent from "../api/agent";
import { PagedResult, Puzzle } from "../types";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";

export const usePuzzles = (id?: string) => {
    const { puzzleStore: { difficulty } } = useStore();
    const queryClient = useQueryClient();
    const { currentUser } = useAccount();
    const location = useLocation();

    const { data: puzzlesGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage }
        = useInfiniteQuery<PagedResult<Puzzle, string>>({
            queryKey: ['puzzles', difficulty],
            queryFn: async ({ pageParam = null }) => {
                const response = await agent.get<PagedResult<Puzzle, string>>('/puzzles', {
                    params: {
                        cursor: pageParam,
                        pageSize: 6,
                        difficulty: difficulty || undefined,
                    }
                });
                return response.data;
            },
            placeholderData: keepPreviousData,
            initialPageParam: null,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: !id && location.pathname === '/puzzles' && !!currentUser,
        });

    const { data: puzzle } = useQuery({
        queryKey: ['puzzles', id],
        queryFn: async () => {
            const response = await agent.get<Puzzle>(`/puzzles/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,
    });

    const createPuzzle = useMutation({
        mutationFn: async (puzzle: FieldValues) => {
            const response = await agent.post('/puzzles', puzzle);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        }
    });

    const updatePuzzle = useMutation({
        mutationFn: async (puzzle: Puzzle) => {
            await agent.put('/puzzles', puzzle);
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['puzzles'] });
        }
    });

    const deletePuzzle = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/puzzles/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        }
    });

    return {
        puzzlesGroup,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        puzzle,
        createPuzzle,
        updatePuzzle,
        deletePuzzle,
    };
};