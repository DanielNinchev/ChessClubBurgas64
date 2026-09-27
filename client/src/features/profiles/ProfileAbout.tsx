import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button, Divider,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import AccountSettings from "./AccountSettings";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileAbout() {
    const { id } = useParams();
    const { profile, isCurrentUser } = useProfile(id);
    const [editMode, setEditMode] = useState(false);

    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');

    return (
        <Box>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">За {fullName}</Typography>
                {isCurrentUser && (
                    <Button
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? 'Отказ' : 'Редактирай'}
                    </Button>
                )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ overflow: 'auto', maxHeight: 350 }}>
                {editMode && profile ? (
                    <ProfileEditForm profile={profile} setEditMode={setEditMode} />
                ) : (
                    <Box sx={{ mt: 2 }}>
                        {profile?.bio && (
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {profile.bio}
                            </Typography>
                        )}
                        {profile?.school && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Училище: {profile.school}
                            </Typography>
                        )}
                        {profile?.address && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Адрес: {profile.address}
                            </Typography>
                        )}
                        {profile?.specialization && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Специализация: {profile.specialization}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
            {isCurrentUser && (
                <>
                    <Divider sx={{ my: 3 }} />
                    {profile && <AccountSettings profile={profile} />}
                </>
            )}
        </Box>
    )
}