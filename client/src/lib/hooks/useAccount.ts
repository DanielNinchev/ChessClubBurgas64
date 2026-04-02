import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { User } from "../types";

export const useAccount = () => {
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading: loadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
        retry: false,
        staleTime: Infinity,
    });

    const loginUser = useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            await agent.post('/login?useCookies=true', credentials);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    const registerUser = useMutation({
        mutationFn: async (data: {
            email: string;
            firstName: string;
            middleName: string;
            lastName: string;
            password: string;
            invitationToken: string;
        }) => {
            await agent.post('/account/register', data);
        },
    });

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.clear();
        },
    });

    const verifyEmail = useMutation({
        mutationFn: async (data: { userId: string; code: string }) => {
            await agent.post('/account/verifyEmail', null, {
                params: { userId: data.userId, code: data.code },
            });
        },
    });

    const resendConfirmationEmail = useMutation({
        mutationFn: async (data: { email?: string; userId?: string }) => {
            await agent.get('/account/resendConfirmEmail', {
                params: data,
            });
        },
    });

    const forgotPassword = useMutation({
        mutationFn: async (data: { email: string }) => {
            await agent.post('/account/forgot-password', { email: data.email });
        },
    });

    const resetPassword = useMutation({
        mutationFn: async (data: { email: string; token: string; newPassword: string }) => {
            await agent.post('/account/reset-password', {
                email: data.email,
                token: data.token,
                newPassword: data.newPassword,
            });
        },
    });

    const changePassword = useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
            await agent.post('/account/change-password', data);
        },
    });

    const validateInvitation = useMutation({
        mutationFn: async (token: string) => {
            const response = await agent.get<{ email: string; role: string }>(
                '/account/validate-invitation',
                { params: { token } }
            );
            return response.data;
        },
    });

    const createInvitation = useMutation({
        mutationFn: async (data: { email: string; role: string; teacherId?: string }) => {
            const response = await agent.post<{ registrationLink: string; expiresAt: string }>(
                '/account/create-invitation',
                data
            );
            return response.data;
        },
    });

    const isAdmin = currentUser?.roles?.includes('Admin') ?? false;
    const isTeacher = currentUser?.roles?.includes('Teacher') ?? false;
    const isStudent = currentUser?.roles?.includes('Student') ?? false;

    return {
        currentUser,
        loadingUser,
        loginUser,
        registerUser,
        logoutUser,
        verifyEmail,
        resendConfirmationEmail,
        forgotPassword,
        resetPassword,
        changePassword,
        validateInvitation,
        createInvitation,
        isAdmin,
        isTeacher,
        isStudent,
    };
};