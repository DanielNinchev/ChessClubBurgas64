import { createBrowserRouter, Navigate } from "react-router";
import ChangePasswordForm from "../../features/account/ChangePasswordForm";
import ConfirmEmailChangePage from '../../features/account/ConfirmEmailChangePage';
import ConfirmEmailPage from '../../features/account/ConfirmEmailPage';
import ForgotPasswordForm from "../../features/account/ForgotPasswordForm";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import ResetPasswordForm from "../../features/account/ResetPasswordForm";
import CreateInvitationForm from '../../features/admin/CreateInvitationForm';
import AnnouncementDashboard from "../../features/announcements/dashboard/AnnouncementDashboard";
import AnnouncementDetails from "../../features/announcements/details/AnnouncementDetails";
import AnnouncementForm from "../../features/announcements/form/AnnouncementForm";
import ContactsPage from "../../features/contacts/ContactsPage";
import Counter from "../../features/counter/Counter";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import TestErrors from "../../features/errors/TestErrors";
import HomePage from "../../features/home/HomePage";
import LessonDashboard from "../../features/lessons/dashboard/LessonDashboard";
import LessonDetails from "../../features/lessons/details/LessonDetails";
import LessonForm from "../../features/lessons/form/LessonForm";
import { default as ProfilePage, default as StudentProfilePage } from "../../features/profiles/ProfilePage";
import PuzzleDashboard from "../../features/puzzles/dashboard/PuzzleDashboard";
import PuzzleDetails from "../../features/puzzles/details/PuzzleDetails";
import PuzzleForm from "../../features/puzzles/form/PuzzleForm";
import StudentsPage from "../../features/students/StudentsPage";
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
                    { path: 'puzzles/create', element: <PuzzleForm key='create' /> },
                    { path: 'puzzles/update/:id', element: <PuzzleForm key='update' /> },
                    { path: 'profiles/:id', element: <ProfilePage /> },
                    { path: 'student-profile', element: <StudentProfilePage /> },
                    { path: 'change-password', element: <ChangePasswordForm /> },
                    { path: 'lessons', element: <LessonDashboard /> },
                    { path: 'lessons/:id', element: <LessonDetails /> },
                    { path: 'lessons/create', element: <LessonForm key='create' /> },
                    { path: 'lessons/edit/:id', element: <LessonForm key='edit' /> },
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'announcements', element: <AnnouncementDashboard /> },
            { path: 'announcements/:id', element: <AnnouncementDetails /> },
            { path: 'puzzles', element: <PuzzleDashboard /> },
            { path: 'puzzles/:id', element: <PuzzleDetails /> },
            { path: 'contacts', element: <ContactsPage /> },
            { path: 'counter', element: <Counter /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'admin/invitations', element: <CreateInvitationForm /> },
            { path: 'confirm-email', element: <ConfirmEmailPage /> },
            { path: 'confirm-email-change', element: <ConfirmEmailChangePage /> },
            { path: 'forgot-password', element: <ForgotPasswordForm /> },
            { path: 'reset-password', element: <ResetPasswordForm /> },
            { path: 'manage/puzzle/:id', element: <PuzzleForm /> },
            { path: 'students', element: <StudentsPage /> },
            { path: '*', element: <Navigate replace to='/not-found' /> },
        ]
    }
])