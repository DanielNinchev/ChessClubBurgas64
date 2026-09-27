import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import TextInput from "../../app/shared/components/TextInput";
import { useProfile } from "../../lib/hooks/useProfile";
import { editProfileSchema, EditProfileSchema } from "../../lib/schemas/editProfileSchema";
import { Profile } from "../../lib/types";

type Props = {
    profile: Profile;
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm({ profile, setEditMode }: Props) {
    const { updateProfile } = useProfile(profile.id);
    const isStudent = profile.roles?.includes('Student');
    const isTeacher = profile.roles?.includes('Teacher');

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<EditProfileSchema>({
        mode: 'onTouched',
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: profile?.firstName ?? '',
            middleName: profile?.middleName ?? '',
            lastName: profile?.lastName ?? '',
            phoneNumber: profile?.phoneNumber ?? '',
            bio: profile?.bio ?? '',
            specialization: profile?.specialization ?? '',
        }
    });

    const onSubmit = (data: EditProfileSchema) => {
        updateProfile.mutate(isStudent ? { ...data, phoneNumber: undefined } : data, {
            onSuccess: () => setEditMode(false)
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
            <TextInput label="Име" control={control} name="firstName" />
            <TextInput label="Презиме" control={control} name="middleName" />
            <TextInput label="Фамилия" control={control} name="lastName" />
            {/* Students edit their phone, address and school under "Ученически данни" */}
            {!isStudent && <TextInput label="Телефон" control={control} name="phoneNumber" />}

            {isTeacher && (
                <>
                    <TextInput label="Биография" control={control} name="bio" multiline rows={4} />
                    <TextInput label="Специализация" control={control} name="specialization" />
                </>
            )}

            <Box display="flex" gap={1} justifyContent="flex-end">
                <Button onClick={() => setEditMode(false)}>Отказ</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isValid || isSubmitting || updateProfile.isPending}
                >
                    {updateProfile.isPending ? 'Запазване...' : 'Запази'}
                </Button>
            </Box>
        </Box>
    );
}