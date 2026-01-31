import { LockOpen } from "@mui/icons-material";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import AccountFormWrapper from "./AccountFormWrapper";

export default function ForgotPasswordForm() {
    const { forgotPassword } = useAccount();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        try {
            await forgotPassword.mutateAsync(data.email, {
                onSuccess: () => {
                    toast.success('Password reset requested - please check your email');
                    navigate('/login')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AccountFormWrapper
            title='Моля, въведете електронната си поща'
            icon={<LockOpen fontSize="large" />}
            submitButtonText="Изискайте линк за смяна на паролата"
            onSubmit={onSubmit}
        >
            <TextInput rules={{ required: true }} label='Електронна поща' name='email' />
        </AccountFormWrapper>

    )
}