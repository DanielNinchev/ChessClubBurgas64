import { Avatar, Box, Divider, Fade, Paper, Popper, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { Profile } from '../../../lib/types';

type Props = {
    profile: Profile;
}

export default function AvatarPopover({ profile }: Props) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

    return (
        <Box
            ref={anchorRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Avatar
                alt={fullName + ' image'}
                src={'/images/user.png'}
                component={Link}
                to={`/profiles/${profile.id}`}
            />
            <Popper open={open} anchorEl={anchorRef.current} placement='bottom-start' transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper elevation={4} sx={{ p: 2, maxWidth: 300 }}>
                            <Box display='flex' alignItems='center' gap={2}>
                                <Avatar
                                    alt={fullName}
                                    src={'/images/user.png'}
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight='bold'>
                                        {fullName}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {profile.roles?.includes('Teacher') ? 'Учител' :
                                    profile.roles?.includes('Student') ? 'Ученик' : ''}
                            </Typography>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}
