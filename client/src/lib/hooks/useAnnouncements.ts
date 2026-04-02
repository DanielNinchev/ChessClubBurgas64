import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { Announcement, PagedResult, Photo } from "../types";

export const useAnnouncements = (id?: string) => {
    const queryClient = useQueryClient();

    const {
        data: announcementsGroup,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<PagedResult<Announcement, string | null>>({
        queryKey: ['announcements'],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            if (pageParam) params.append('cursor', pageParam as string);
            const response = await agent.get<PagedResult<Announcement, string | null>>(
                `/announcements?${params.toString()}`
            );
            return response.data;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const { data: announcement, isLoading: loadingAnnouncement } = useQuery({
        queryKey: ['announcements', id],
        queryFn: async () => {
            const response = await agent.get<Announcement>(`/announcements/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const createAnnouncement = useMutation({
        mutationFn: async (data: { title: string; description: string; text: string; date: Date; file: Blob }) => {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('text', data.text);
            formData.append('date', data.date.toISOString());
            formData.append('file', data.file);

            const response = await agent.post<string>('/announcements', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
    });

    const updateAnnouncement = useMutation({
        mutationFn: async (data: { id: string; title: string; description: string; text: string; date: string }) => {
            await agent.put(`/announcements/${data.id}`, {
                title: data.title,
                description: data.description,
                text: data.text,
                date: data.date,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            if (id) queryClient.invalidateQueries({ queryKey: ['announcements', id] });
        },
    });

    const deleteAnnouncement = useMutation({
        mutationFn: async (announcementId: string) => {
            await agent.delete(`/announcements/${announcementId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
    });

    const uploadPhoto = useMutation({
        mutationFn: async (data: { announcementId: string; file: Blob }) => {
            const formData = new FormData();
            formData.append('file', data.file);
            const response = await agent.post<Photo>(`/announcements/${data.announcementId}/photos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            if (id) queryClient.invalidateQueries({ queryKey: ['announcements', id] });
        },
    });

    return {
        announcementsGroup,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        announcement,
        loadingAnnouncement,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        uploadPhoto,
    };
};