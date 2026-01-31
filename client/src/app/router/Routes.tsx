import { createBrowserRouter, Navigate } from "react-router";
import ChangePasswordForm from "../../features/account/ChangePasswordForm";
import ForgotPasswordForm from "../../features/account/ForgotPasswordForm";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import ResetPasswordForm from "../../features/account/ResetPasswordForm";
import VerifyEmail from "../../features/account/VerifyEmail";
import AnnouncementDashboard from "../../features/announcements/dashboard/AnnouncementDashboard";
import AnnouncementDetails from "../../features/announcements/details/AnnouncementDetails";
import AnnouncementForm from "../../features/announcements/form/AnnouncementForm";
import Counter from "../../features/counter/Counter";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import TestErrors from "../../features/errors/TestErrors";
import HomePage from "../../features/home/HomePage";
import ProfilePage from "../../features/profiles/ProfilePage";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: 'announcements/create', element: <AnnouncementForm key='create' /> },
                    { path: 'announcements/update/:id', element: <AnnouncementForm key='update' /> },
                    { path: 'profiles/:id', element: <ProfilePage /> },
                    { path: 'change-password', element: <ChangePasswordForm /> },
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'announcements', element: <AnnouncementDashboard /> },
            { path: 'counter', element: <Counter /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'confirm-email', element: <VerifyEmail /> },
            { path: 'forgot-password', element: <ForgotPasswordForm /> },
            { path: 'reset-password', element: <ResetPasswordForm /> },
            { path: '*', element: <Navigate replace to='/not-found' /> },

            { path: 'announcements', element: <AnnouncementDashboard /> },
            { path: 'announcements/:id', element: <AnnouncementDetails /> },

            //{ path: 'contacts', element: <Contacts /> },

            // { path: 'puzzles', element: <PuzzleDashboard /> },
            // { path: 'puzzles/create', element: <PuzzleForm key='create' /> },
            // { path: 'puzzles/update/:id', element: <PuzzleForm key='update' /> },
        ]
    }
])