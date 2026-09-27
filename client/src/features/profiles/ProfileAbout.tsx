import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box, Button, Divider,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileAbout() {
    const { id } = useParams();
    const { profile, isCurrentUser, updateProfile } = useProfile(id);
    const [editMode, setEditMode] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);

    // Populate form whenever profile loads/changes
    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName ?? '');
            setMiddleName(profile.middleName ?? '');
            setLastName(profile.lastName ?? '');
            setEmail(profile.email ?? '');
            setPhoneNumber(profile.phoneNumber ?? '');
            setBio(profile.bio ?? '');
        }
    }, [profile]);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            await updateProfile.mutateAsync({
                firstName, middleName, lastName, email, phoneNumber, bio,
            });
        } finally {
            setSaving(false);
        }
    };

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
            {isCurrentUser && !editMode && (
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Запазване...' : 'Запази'}
                    </Button>
                </Box>
            )}
        </Box>
    )
}