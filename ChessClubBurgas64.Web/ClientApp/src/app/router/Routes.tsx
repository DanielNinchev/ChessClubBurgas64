import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import AnnouncementDashboard from "../../features/announcements/AnnouncementDashboard";
import AnnouncementDetails from "../../features/announcements/AnnouncementDetails";
import AnnouncementForm from "../../features/announcements/AnnouncementForm";
import App from "../layout/App";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import ProfilePage from "../profiles/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth />, children: [
                {path: 'createAnnouncement', element: <AnnouncementForm key='create' />},
                {path: 'updateAnnouncement', element: <AnnouncementForm key='update' />},
                {path: 'manage/:id', element: <AnnouncementForm key='manage' />},
                {path: 'profiles/:username', element: <ProfilePage />},
            ]},
            {path: 'announcements', element: <AnnouncementDashboard />},
            {path: 'announcements/create', element: <AnnouncementForm key='create' />},
            {path: 'announcements/update/:id', element: <AnnouncementForm key='update' />},
            {path: 'announcements/:id', element: <AnnouncementDetails />},
            {path: 'not-found', element: <NotFound />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <Navigate replace to='/not-found' />},
        ]
    }
]

export const router = createBrowserRouter(routes);