import { zodResolver } from '@hookform/resolvers/zod';
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Button, CardMedia, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import PhotoUploadWidget from "../../../app/shared/components/PhotoUploadWidget";
import SunEditor from "../../../app/shared/components/SunEditor";
import TextInput from "../../../app/shared/components/TextInput";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import { AnnouncementSchema, announcementSchema } from "../../../lib/schemas/announcementSchema";

export default function AnnouncementForm() {
    const { control, reset, handleSubmit, formState: { isValid, isSubmitting } } = useForm<AnnouncementSchema>({
        mode: 'onTouched',
        resolver: zodResolver(announcementSchema)
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const { updateAnnouncement, createAnnouncement, announcement, isLoading } = useAnnouncements(id);
    const [photoFile, setPhotoFile] = useState<Blob | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const isEditing = !!id; // use id, not announcement, to determine intent

    useEffect(() => {
        if (announcement) {
            reset({
                title: announcement.title,
                description: announcement.description,
                text: announcement.text,
            });
            if (announcement.mainPhotoUrl) {
                setPhotoPreview(announcement.mainPhotoUrl);
            }
        }
    }, [announcement, reset]);

    // Wait for announcement to load before rendering the form when editing
    // This ensures SunEditor mounts with the correct initial value
    if (isEditing && isLoading) return <LoadingComponent />;
    if (isEditing && !announcement) return <Typography>Новината не е намерена</Typography>;

    const handlePhotoSelected = (file: Blob) => {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data: AnnouncementSchema) => {
        try {
            if (isEditing) {
                if (!announcement) return;
                updateAnnouncement.mutate(
                    {
                        id: announcement.id,
                        title: data.title,
                        description: data.description,
                        text: data.text,
                        file: photoFile,   // ← pass the new photo (null = keep existing)
                    },
                    {
                        onSuccess: () => navigate(`/announcements/${announcement.id}`)
                    }
                );
            } else {
                if (!photoFile) return;
                createAnnouncement.mutate(
                    {
                        title: data.title,
                        description: data.description,
                        text: data.text,
                        file: photoFile,
                    },
                    {
                        onSuccess: (newId) => navigate(`/announcements/${newId}`)
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const canSubmit = isEditing
        ? isValid
        : isValid && !!photoFile;

    return (
        <Container
            maxWidth="md"
            sx={{
                pt: { xs: 9, md: 12 },
                pb: 4,
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    p: { xs: 2, sm: 3, md: 4 },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" fontWeight={700} color="primary.dark">
                        {isEditing ? 'Редактиране на новина' : 'Публикуване на новина'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {isEditing
                            ? 'Редактирайте полетата по-долу и натиснете „Потвърди"'
                            : 'Попълнете полетата, добавете снимка и натиснете „Публикувай"'}
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                >
                    <TextInput label="Заглавие" control={control} name="title" />
                    <TextInput label="Описание" control={control} name="description" multiline rows={3} />

                    {/* 
                        Key forces SunEditor to remount if announcement changes.
                        defaultValue seeds the editor on first mount.
                    */}
                    <SunEditor
                        key={announcement?.id ?? 'new'}
                        label="Текст"
                        control={control}
                        name="text"
                        defaultValue={announcement?.text}
                    />

                    {/* Photo Upload Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                            Снимка {!isEditing && <span style={{ color: 'red' }}>*</span>}
                        </Typography>

                        {photoPreview && (
                            <CardMedia
                                component="img"
                                image={photoPreview}
                                alt="Преглед на снимката"
                                sx={{
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    borderRadius: 2,
                                    mb: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                        )}

                        <PhotoUploadWidget
                            uploadPhoto={handlePhotoSelected}
                            loading={createAnnouncement.isPending}
                        />

                        {!isEditing && !photoFile && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                Моля, добавете поне една снимка
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outlined"
                            color="inherit"
                            size="large"
                        >
                            Отказ
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={!canSubmit || isSubmitting || createAnnouncement.isPending || updateAnnouncement.isPending}
                        >
                            {isSubmitting || createAnnouncement.isPending || updateAnnouncement.isPending
                                ? 'Запазване...'
                                : isEditing ? 'Потвърди' : 'Публикувай'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}