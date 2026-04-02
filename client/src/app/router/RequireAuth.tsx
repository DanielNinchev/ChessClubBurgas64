import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";

export default function RequireAuth() {
    const { currentUser } = useAccount();
    const location = useLocation();

    if (currentUser === undefined) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Outlet />;
}