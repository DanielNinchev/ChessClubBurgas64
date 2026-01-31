import { zodResolver } from "@hookform/resolvers/zod";
import { Password } from "@mui/icons-material";
import { toast } from "react-toastify";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import { changePasswordSchema, ChangePasswordSchema } from "../../lib/schemas/changePasswordSchema";
import AccountFormWrapper from "./AccountFormWrapper";

export default function ChangePasswordForm() {
    const { changePassword } = useAccount();
    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            await changePassword.mutateAsync(data, {
                onSuccess: () => toast.success('Your password has been changed')
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AccountFormWrapper<ChangePasswordSchema>
            title='Change password'
            icon={<Password fontSize="large" />}
            onSubmit={onSubmit}
            submitButtonText="Update password"
            resolver={zodResolver(changePasswordSchema)}
            reset={true}
        >
            <TextInput type="password" label="Сегашна парола" name="currentPassword" />
            <TextInput type="password" label="Нова парола" name="newPassword" />
            <TextInput type="password" label="Потвърдете паролата" name="confirmPassword" />
        </AccountFormWrapper>
    )
}