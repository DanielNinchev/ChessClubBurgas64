import { Group } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, Container, MenuItem, Toolbar, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { NavLink } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { useStore } from "../../lib/hooks/useStore";
import MenuItemLink from "../shared/components/MenuItemLink";
import UserMenu from "./UserMenu";

export default function NavBar() {
    const { uiStore } = useStore();
    const { currentUser } = useAccount();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed"
                sx={{
                    backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'
                }}>
                <Container maxWidth='xl'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <MenuItem component={NavLink} to='/' sx={{ display: 'flex', gap: 2 }}>
                                <Group fontSize="large" />
                                <Typography sx={{ position: 'relative' }} variant="h4" fontWeight='bold'>
                                    ШК Бургас-64
                                </Typography>
                                <Observer>
                                    {() => uiStore.isLoading ? (
                                        <CircularProgress
                                            size={20}
                                            thickness={7}
                                            sx={{
                                                color: 'white',
                                                position: 'absolute',
                                                top: '30%',
                                                left: '105%'
                                            }}
                                        />
                                    ) : null}
                                </Observer>
                            </MenuItem>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <MenuItemLink to='/announcements'>
                                Новини
                            </MenuItemLink>
                            <MenuItemLink to='/contacts'>
                                Контакти
                            </MenuItemLink>
                            <MenuItemLink to='/errors'>
                                Errors
                            </MenuItemLink>
                        </Box>
                        <Box display='flex' alignItems='center'>
                            {currentUser ? (
                                <UserMenu />
                            ) : (
                                <>
                                    <MenuItemLink to='/login'>Вход</MenuItemLink>
                                    <MenuItemLink to='/register'>Регистрация</MenuItemLink>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}