import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ExtensionIcon from '@mui/icons-material/Extension';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Observer } from "mobx-react-lite";
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAccount } from '../../lib/hooks/useAccount';
import { useStore } from '../../lib/hooks/useStore';

const navLinks = [
    { label: 'Новини', path: '/announcements', icon: <NewspaperIcon /> },
    { label: 'За нас', path: '/about', icon: <InfoIcon /> },
    { label: 'История', path: '/history', icon: <HistoryEduIcon /> },
    { label: 'Контакти', path: '/contacts', icon: <ContactMailIcon /> },
];

const adminMenuItems = [
    { label: 'Публикувай новина', path: '/announcements/create', icon: <PostAddIcon /> },
    { label: 'Качи шахматна задача', path: '/puzzles/create', icon: <ExtensionIcon /> },
    { label: 'Преглед на ученици', path: '/admin/students', icon: <PeopleIcon /> },
    { label: 'График', path: '/admin/schedule', icon: <CalendarMonthIcon /> },
];

export default function NavBar() {
    const { uiStore } = useStore();
    const { currentUser, isAdmin, logoutUser } = useAccount();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserAnchorEl(null);
    };

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminAnchorEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminAnchorEl(null);
    };

    const handleLogout = () => {
        logoutUser.mutate();
        handleUserMenuClose();
        setDrawerOpen(false);
    };

    const handleDrawerNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    // Mobile Drawer
    const drawer = (
        <Box sx={{ width: 280 }}>
            {/* Drawer Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    background: 'linear-gradient(135deg, #094D61 0%, #0D6E8A 100%)',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        component="img"
                        src="/images/logo.png"
                        alt="ШК Бургас-64"
                        sx={{
                            height: 36,
                            width: 36,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.4)',
                            objectFit: 'cover',
                        }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                        ШК Бургас-64
                    </Typography>
                </Box>
                <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* User info in drawer */}
            {currentUser && (
                <>
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                                fontSize: '0.9rem',
                            }}
                        >
                            {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {currentUser.firstName} {currentUser.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {currentUser.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider />
                </>
            )}

            {/* Nav Links */}
            <List>
                <Box sx={{ px: 2, pt: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                        Навигация
                    </Typography>
                </Box>
                {navLinks.map((link) => (
                    <ListItem key={link.path} disablePadding>
                        <ListItemButton
                            onClick={() => handleDrawerNavigate(link.path)}
                            sx={{
                                py: 1.2,
                                '&:hover': { backgroundColor: 'rgba(13, 110, 138, 0.08)' },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            {/* Admin section */}
            {isAdmin && (
                <>
                    <List>
                        <Box sx={{ px: 2, pt: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                                Администрация
                            </Typography>
                        </Box>
                        {adminMenuItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    onClick={() => handleDrawerNavigate(item.path)}
                                    sx={{
                                        py: 1.2,
                                        '&:hover': { backgroundColor: 'rgba(13, 110, 138, 0.08)' },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </>
            )}

            {/* Auth section */}
            <List>
                {currentUser ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleDrawerNavigate(`/profiles/${currentUser.id}`)}
                                sx={{ py: 1.2 }}
                            >
                                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                                        {currentUser.firstName?.[0]}
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary="Моят профил" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ py: 1.2 }}>
                                <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Изход" sx={{ color: 'error.main' }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleDrawerNavigate('/login')}
                                sx={{ py: 1.2 }}
                            >
                                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Вход" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                sx={{
                    background: 'linear-gradient(135deg, #094D61 0%, #0D6E8A 40%, #1BA3C6 100%)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 64 } }}>
                        {/* Left section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Mobile hamburger */}
                            {isMobile && (
                                <IconButton
                                    onClick={() => setDrawerOpen(true)}
                                    sx={{ color: 'white', mr: 0.5 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}

                            <Box
                                component={Link}
                                to="/"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: 'white',
                                    mr: { xs: 0, md: 3 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/images/logo.png"
                                    alt="ШК Бургас-64"
                                    sx={{
                                        height: { xs: 36, md: 42 },
                                        width: { xs: 36, md: 42 },
                                        mr: 1.5,
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255, 255, 255, 0.4)',
                                        objectFit: 'cover',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '0.5px',
                                        display: { xs: 'none', sm: 'block' },
                                        fontSize: { sm: '1rem', md: '1.25rem' },
                                    }}
                                >
                                    ШК Бургас-64
                                </Typography>
                                <Observer>
                                    {() => uiStore.isLoading ? (
                                        <CircularProgress
                                            size={20}
                                            thickness={7}
                                            sx={{
                                                color: 'white',
                                                ml: 1,
                                            }}
                                        />
                                    ) : null}
                                </Observer>
                            </Box>

                            {/* Desktop nav links */}
                            {!isMobile && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {navLinks.map((link) => (
                                        <Button
                                            key={link.path}
                                            component={NavLink}
                                            to={link.path}
                                            startIcon={link.icon}
                                            sx={{
                                                color: 'white',
                                                fontSize: { md: '0.85rem', lg: '0.95rem' },
                                                px: { md: 1.5, lg: 2 },
                                                py: 1,
                                                borderRadius: 2,
                                                whiteSpace: 'nowrap',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                },
                                                '&.active': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    fontWeight: 700,
                                                },
                                            }}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* Right section - Desktop only */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* Admin Dropdown */}
                                {isAdmin && (
                                    <>
                                        <Button
                                            onClick={handleAdminMenuOpen}
                                            startIcon={<AdminPanelSettingsIcon />}
                                            endIcon={<KeyboardArrowDownIcon />}
                                            sx={{
                                                color: 'white',
                                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                px: 2,
                                                py: 0.8,
                                                borderRadius: 2,
                                                fontSize: { md: '0.8rem', lg: '0.875rem' },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                                },
                                            }}
                                        >
                                            Управление
                                        </Button>
                                        <Menu
                                            anchorEl={adminAnchorEl}
                                            open={Boolean(adminAnchorEl)}
                                            onClose={handleAdminMenuClose}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        mt: 1,
                                                        minWidth: 240,
                                                        borderRadius: 2,
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                                    }
                                                }
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1 }}>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    fontWeight={600}
                                                    textTransform="uppercase"
                                                    letterSpacing={1}
                                                >
                                                    Администрация
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            {adminMenuItems.map((item) => (
                                                <MenuItem
                                                    key={item.path}
                                                    component={Link}
                                                    to={item.path}
                                                    onClick={handleAdminMenuClose}
                                                    sx={{
                                                        py: 1.2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(13, 110, 138, 0.08)',
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ color: 'primary.main' }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText>{item.label}</ListItemText>
                                                </MenuItem>
                                            ))}
                                            {isAdmin && (
                                                <MenuItem component={Link} to="/admin/invitations">
                                                    <PersonAddIcon sx={{ mr: 1 }} fontSize="small" />
                                                    Генерирай покана
                                                </MenuItem>
                                            )}
                                        </Menu>
                                    </>
                                )}

                                {/* User section */}
                                {currentUser ? (
                                    <>
                                        <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    width: 36,
                                                    height: 36,
                                                    fontSize: '0.9rem',
                                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                                }}
                                            >
                                                {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            anchorEl={userAnchorEl}
                                            open={Boolean(userAnchorEl)}
                                            onClose={handleUserMenuClose}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        mt: 1,
                                                        minWidth: 200,
                                                        borderRadius: 2,
                                                    }
                                                }
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {currentUser.firstName} {currentUser.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {currentUser.email}
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <MenuItem
                                                component={Link}
                                                to={`/profiles/${currentUser.id}`}
                                                onClick={handleUserMenuClose}
                                            >
                                                Моят профил
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                Изход
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            component={NavLink}
                                            to="/login"
                                            variant="contained"
                                            startIcon={<LoginIcon />}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                fontSize: { md: '0.8rem', lg: '0.875rem' },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                },
                                            }}
                                        >
                                            Вход
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )}

                        {/* Mobile right - user avatar only */}
                        {isMobile && currentUser && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 0.5 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        width: 34,
                                        height: 34,
                                        fontSize: '0.85rem',
                                        border: '2px solid rgba(255, 255, 255, 0.4)',
                                    }}
                                >
                                    {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                                </Avatar>
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '0 16px 16px 0' },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
}