import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import agent from "../api/agent";
import { EditProfileSchema } from "../schemas/editProfileSchema";
import { Photo, Profile, User } from '../types';

export const useProfile = (id?: string, predicate?: string) => {
    const [filter, setFilter] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data
        },
        enabled: !!id && !predicate
    })

    const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id && !predicate
    });

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', id]
            });
        }
    })

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', id] });
        }
    })

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`)
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    });

    const updateProfile = useMutation({
        mutationFn: async (profileData: EditProfileSchema) => {
            await agent.put(`/profiles`, profileData);
        },
        onSuccess: (_, profileData) => {
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    firstName: profileData.firstName,
                    middleName: profileData.middleName,
                    lastName: profileData.lastName,
                    phoneNumber: profileData.phoneNumber,
                    bio: profileData.bio,
                    address: profileData.address,
                    school: profileData.school,
                    specialization: profileData.specialization,
                }
            });
            queryClient.setQueryData(['user'], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    firstName: profileData.firstName,
                    middleName: profileData.middleName,
                    lastName: profileData.lastName,
                }
            });
        }
    })

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id
    }, [id, queryClient])

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto,
        updateProfile,
        setFilter,
        filter
    }
}

