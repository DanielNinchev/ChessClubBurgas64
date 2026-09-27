import { zodResolver } from "@hookform/resolvers/zod";
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SchoolIcon from '@mui/icons-material/School';
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DateInput from "../../app/shared/components/DateInput";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import { useProfile } from "../../lib/hooks/useProfile";
import { changeEmailSchema, ChangeEmailSchema } from "../../lib/schemas/changeEmailSchema";
import { changePasswordSchema, ChangePasswordSchema } from "../../lib/schemas/changePasswordSchema";
import { studentDataSchema, StudentDataSchema } from "../../lib/schemas/studentDataSchema";
import { Profile } from "../../lib/types";

// The submit buttons deliberately don't wait for formState.isValid: in 'onTouched' mode it only refreshes on blur,
// so the button would still be disabled when pressed and swallow the first click. handleSubmit validates anyway.

// Validation errors from Identity arrive as an array (see agent.ts); other 400s are toasted there already
const showErrors = (error: unknown) => {
    if (Array.isArray(error)) error.forEach(e => toast.error(e));
}

function Section({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) {
    return (
        <Box>
            <Box display='flex' alignItems='center' gap={1} color='primary.main' mb={2}>
                {icon}
                <Typography variant="h6">{title}</Typography>
            </Box>
            {children}
        </Box>
    )
}

function ChangeEmailSection({ currentEmail }: { currentEmail?: string }) {
    const { changeEmail } = useAccount();
    const methods = useForm<ChangeEmailSchema>({ resolver: zodResolver(changeEmailSchema), mode: 'onTouched' });

    const onSubmit = async (data: ChangeEmailSchema) => {
        try {
            await changeEmail.mutateAsync(data);
            toast.success(`Изпратихме линк за потвърждение на ${data.newEmail}`);
            methods.reset();
        } catch (error) {
            showErrors(error);
        }
    }

    return (
        <Section icon={<EmailIcon />} title="Имейл адрес">
            <Typography variant="body1" mb={2}>
                Текущ имейл: <strong>{currentEmail}</strong>
            </Typography>
            <FormProvider {...methods}>
                <Stack component='form' onSubmit={methods.handleSubmit(onSubmit)} gap={2}>
                    <TextInput<ChangeEmailSchema> label="Нов имейл" name="newEmail" size="small" />
                    <TextInput<ChangeEmailSchema> type="password" label="Сегашна парола" name="currentPassword" size="small" />
                    <Box display='flex' justifyContent='flex-end'>
                        <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                            Смени имейла
                        </Button>
                    </Box>
                </Stack>
            </FormProvider>
        </Section>
    )
}

function ChangePasswordSection() {
    const { changePassword } = useAccount();
    const methods = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema), mode: 'onTouched' });

    const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordSchema) => {
        try {
            await changePassword.mutateAsync({ currentPassword, newPassword });
            toast.success('Паролата е сменена успешно');
            methods.reset();
        } catch (error) {
            showErrors(error);
        }
    }

    return (
        <Section icon={<LockIcon />} title="Парола">
            <FormProvider {...methods}>
                <Stack component='form' onSubmit={methods.handleSubmit(onSubmit)} gap={2}>
                    <TextInput<ChangePasswordSchema> type="password" label="Сегашна парола" name="currentPassword" size="small" />
                    <TextInput<ChangePasswordSchema> type="password" label="Нова парола" name="newPassword" size="small" />
                    <TextInput<ChangePasswordSchema> type="password" label="Потвърдете новата парола" name="confirmPassword" size="small" />
                    <Box display='flex' justifyContent='flex-end'>
                        <Button type="submit" variant="contained" disabled={methods.formState.isSubmitting}>
                            Смени паролата
                        </Button>
                    </Box>
                </Stack>
            </FormProvider>
        </Section>
    )
}

function StudentDataSection({ profile }: { profile: Profile }) {
    const { updateStudentData } = useProfile(profile.id);
    const methods = useForm<StudentDataSchema>({
        resolver: zodResolver(studentDataSchema),
        mode: 'onTouched',
        defaultValues: {
            address: profile.address ?? '',
            school: profile.school ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            // Stored as UTC midnight, so the date part is the calendar date
            birthDate: profile.birthDate?.slice(0, 10) ?? '',
        },
    });

    const onSubmit = async (data: StudentDataSchema) => {
        try {
            await updateStudentData.mutateAsync(data);
            toast.success('Ученическите данни са запазени');
            methods.reset(data);
        } catch (error) {
            showErrors(error);
        }
    }

    return (
        <Section icon={<SchoolIcon />} title="Ученически данни">
            <Typography variant="body2" color="text.secondary" mb={2}>
                Всички полета са по желание - можете да ги попълните, промените или изтриете по всяко време.
            </Typography>
            <FormProvider {...methods}>
                <Stack component='form' onSubmit={methods.handleSubmit(onSubmit)} gap={2}>
                    <TextInput<StudentDataSchema> label="Адрес" name="address" size="small" />
                    <DateInput<StudentDataSchema> label="Дата на раждане" name="birthDate" disableFuture />
                    <TextInput<StudentDataSchema> label="Училище" name="school" size="small" />
                    <TextInput<StudentDataSchema> label="Телефон" name="phoneNumber" size="small" />
                    <Box display='flex' justifyContent='flex-end'>
                        <Button type="submit" variant="contained"
                            disabled={!methods.formState.isDirty || methods.formState.isSubmitting}>
                            Запази данните
                        </Button>
                    </Box>
                </Stack>
            </FormProvider>
        </Section>
    )
}

function ExportDataSection() {
    const { exportData } = useAccount();

    return (
        <Section icon={<DownloadIcon />} title="Моите лични данни (GDPR)">
            <Typography variant="body2" color="text.secondary" mb={2}>
                Съгласно Общия регламент за защита на данните (GDPR) имате право да получите копие
                на всички лични данни, които съхраняваме за вас. Файлът е във формат JSON.
            </Typography>
            <Box display='flex' justifyContent='flex-end'>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportData.mutate(undefined, {
                        onError: () => toast.error('Неуспешно изтегляне на данните')
                    })}
                    disabled={exportData.isPending}
                >
                    {exportData.isPending ? 'Подготвяне...' : 'Изтегли моите данни'}
                </Button>
            </Box>
        </Section>
    )
}

export default function AccountSettings({ profile }: { profile: Profile }) {
    const { currentUser } = useAccount();
    const isStudent = profile.roles?.includes('Student');

    return (
        <Stack gap={3} divider={<Divider />}>
            <ChangeEmailSection currentEmail={currentUser?.email} />
            <ChangePasswordSection />
            {isStudent && <StudentDataSection profile={profile} />}
            <ExportDataSection />
        </Stack>
    )
}
