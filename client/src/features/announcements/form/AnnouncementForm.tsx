import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import SunEditor from "../../../app/shared/components/SunEditor";
import TextInput from "../../../app/shared/components/TextInput";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import { AnnouncementSchema, announcementSchema } from "../../../lib/schemas/announcementSchema";

export default function AnnouncementForm() {
    const { control, reset, handleSubmit } = useForm<AnnouncementSchema>({
        mode: 'onTouched',
        resolver: zodResolver(announcementSchema)
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const { updateAnnouncement, createAnnouncement, announcement } = useAnnouncements(id);

    useEffect(() => {
        if (announcement) reset({
            ...announcement,
        });
    }, [announcement, reset]);

    const onSubmit = async (data: AnnouncementSchema) => {
        try {
            if (announcement) {
                updateAnnouncement.mutate({ ...announcement, ...data }, {
                    onSuccess: () => navigate(`/announcements/${announcement.id}`)
                })
            } else {
                createAnnouncement.mutate(data, {
                    onSuccess: (id) => navigate(`/announcements/${id}`)
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    //if (isLoadingAnnouncement) return <Typography>Loading announcement...</Typography>

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {announcement ? 'Edit announcement' : 'Create announcement'}
            </Typography>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}>
                <TextInput label='Title' control={control} name='title' />
                <TextInput label='Description' control={control} name='description'
                    multiline rows={3} />
                <DateTimeInput label='Date' control={control} name='date' />
                <SunEditor label='Текстово съдържание:' name='text' initialValue={announcement?.text} />
                <Box display='flex' justifyContent='end' gap={3}>
                    <Button onClick={() => navigate(-1)} color='inherit'>Отказ</Button>
                    <Button
                        type="submit"
                        color='success'
                        variant="contained"
                        disabled={updateAnnouncement.isPending || createAnnouncement.isPending}
                    >Потвърди</Button>
                </Box>
            </Box>
        </Paper>
    )
}