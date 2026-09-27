import ConstructionIcon from '@mui/icons-material/Construction';
import { Box, Typography } from "@mui/material";

type Props = {
    title: string;
    embedded?: boolean;
}

export default function ComingSoon({ title, embedded }: Props) {
    return (
        <Box textAlign='center' mt={embedded ? 4 : 14} color='text.secondary'>
            <ConstructionIcon sx={{ fontSize: 64 }} />
            <Typography variant="h5" gutterBottom>{title}</Typography>
            <Typography variant="body1">Тази секция е в процес на разработка.</Typography>
        </Box>
    )
}
