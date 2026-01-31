import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { ChangePasswordSchema } from "../schemas/changePasswordSchema";
import { LoginSchema } from "../schemas/loginSchema";
import { RegisterSchema } from "../schemas/registerSchema";

export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user'])
    })

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });
        }
    });

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post('/account/register', creds)
        }
    })

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
            navigate('/');
        }
    })

    const verifyEmail = useMutation({
        mutationFn: async ({ userId, code }: { userId: string, code: string }) => {
            await agent.get(`/confirmEmail?userId=${userId}&code=${code}`)
        }
    });

    const resendConfirmationEmail = useMutation({
        mutationFn: async ({ email, userId }: { email?: string, userId?: string | null }) => {
            await agent.get(`/account/resendConfirmEmail`, {
                params: {
                    email,
                    userId
                }
            })
        },
        onSuccess: () => {
            toast.success('Имейлът за потвърждение е изпратен. Моля, проверете електронната си поща.');
        }
    })

    const changePassword = useMutation({
        mutationFn: async (data: ChangePasswordSchema) => {
            await agent.post('/account/change-password', data);
        }
    });

    const forgotPassword = useMutation({
        mutationFn: async (email: string) => {
            await agent.post('/forgotPassword', { email })
        }
    })

    const resetPassword = useMutation({
        mutationFn: async (data: ResetPassword) => {
            await agent.post('/resetPassword', data);
        }
    });

    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser,
        verifyEmail,
        resendConfirmationEmail,
        changePassword,
        forgotPassword,
        resetPassword
    }
}