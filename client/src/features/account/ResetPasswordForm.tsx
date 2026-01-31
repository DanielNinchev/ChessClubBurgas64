import { zodResolver } from "@hookform/resolvers/zod";
import { LockOpen } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import { resetPasswordSchema, ResetPasswordSchema } from "../../lib/schemas/resetPasswordSchema";
import AccountFormWrapper from "./AccountFormWrapper";

export default function ResetPasswordForm() {
    const [params] = useSearchParams();
    const { resetPassword } = useAccount();
    const navigate = useNavigate();

    const email = params.get('email');
    const code = params.get('code');

    if (!email || !code) return <Typography>Грешен код за потвърждение!</Typography>

    const onSubmit = async (data: ResetPasswordSchema) => {
        try {
            await resetPassword.mutateAsync({
                email,
                resetCode: code, newPassword: data.newPassword
            }, {
                onSuccess: () => {
                    toast.success('Паролата бе успешно променена - можете да се впишете сега');
                    navigate('/login');
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AccountFormWrapper<ResetPasswordSchema>
            title='Reset your password'
            submitButtonText="Reset password"
            onSubmit={onSubmit}
            resolver={zodResolver(resetPasswordSchema)}
            icon={<LockOpen fontSize="large" />}
        >
            <TextInput label='Нова парола' type="password" name='newPassword' />
            <TextInput label='Потвърдете паролата' type="password" name='confirmPassword' />
        </AccountFormWrapper>
    )
}