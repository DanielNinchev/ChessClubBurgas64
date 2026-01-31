import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = true, content = 'Зареждане...' }: Props) {
    return (
        <Backdrop
            sx={{
                color: inverted ? '#fff' : '#000',
                backgroundColor: inverted ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            open={true}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress color="inherit" size={60} />
                <Typography variant="h6" color="inherit">
                    {content}
                </Typography>
            </Box>
        </Backdrop>
    )
}