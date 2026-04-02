import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router";
import { Profile } from '../../lib/types';

type Props = {
    profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
    const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ');

    return (
        <Card
            component={Link}
            to={`/profiles/${profile.id}`}
            sx={{ textDecoration: 'none', maxWidth: 250 }}
        >
            <CardMedia
                component="img"
                height="200"
                image={'/images/user.png'}
                alt={fullName + ' image'}
            />
            <CardContent>
                <Typography variant="h5">{fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {profile.roles?.includes('Teacher') ? 'Учител' :
                        profile.roles?.includes('Student') ? 'Ученик' : ''}
                </Typography>
            </CardContent>
        </Card>
    );
}