import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";
import { FieldValues } from "react-hook-form";

export const useAnnouncements = (id?: string) => {
    const {announcementStore: {filter, startDate}} = useStore();
    const queryClient = useQueryClient();
    const { currentUser } = useAccount();
    const location = useLocation();

    const { data: announcementsGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } 
        = useInfiniteQuery<PagedList<Announcement, string>>({
        queryKey: ['announcements', filter, startDate],
        queryFn: async ({pageParam = null}) => {
            const response = await agent.get<PagedList<Announcement, string>>('/announcements', {
                params: {
                    cursor: pageParam,
                    pageSize: 3,
                    filter,
                    startDate
                }
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !id && location.pathname === '/announcements' && !!currentUser,
        select: data => ({
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map(announcement => {
                    //const mainPhoto = announcement.photos.find(x => x.isMain === true);
                    return {
                        ...announcement
                    }
                })
            }))
        })
    });

    const { data: announcement } = useQuery({
        queryKey: ['announcements', id],
        queryFn: async () => {
            const response = await agent.get<Announcement>(`/announcements/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,
        select: data => {
            return {
                ...data,
            }
        }
    })

    const updateAnnouncement = useMutation({
        mutationFn: async (announcement: Announcement) => {
            await agent.put('/announcements', announcement)
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['announcements']
            })
        }
    })

    const createAnnouncement = useMutation({
        mutationFn: async (announcement: FieldValues) => {
            const response = await agent.post('/announcements', announcement);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['announcements']
            })
        }
    });

    const deleteAnnouncement = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/announcements/${id}`)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['announcements']
            })
        }
    });

    return {
        announcementsGroup,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading,
        updateAnnouncement,
        createAnnouncement,
        deleteAnnouncement,
        announcement
    }
}