import { Box, Button, Paper, Typography } from "@mui/material";
import { useAnnouncements } from "../../../lib/hooks/useAnnouncements";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { announcementSchema, ActivitySchema } from "../../../lib/schemas/announcementSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import SunEditor from "../../../app/shared/components/SunEditor";

export default function AnnouncementForm() {
    const { control, reset, handleSubmit } = useForm<ActivitySchema>({
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

    const onSubmit = async (data: Announcement) => {
        try {
            if (announcement) {
                updateAnnouncement.mutate({...announcement, ...data}, {
                    onSuccess: () => navigate(`/activities/${announcement.id}`)
                })
            } else {
                createAnnouncement.mutate(data, {
                    onSuccess: (id) => navigate(`/activities/${id}`)
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    //if (isLoadingActivity) return <Typography>Loading announcement...</Typography>

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
                <SunEditor label='Текстово съдържание:' name='text' initialValue={announcement?.text}/>
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