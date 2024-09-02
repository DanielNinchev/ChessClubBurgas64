import {Button, Container, Dropdown, Menu} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from '../../features/users/LoginForm';
import RegisterForm from "../../features/users/RegisterForm";

export default observer(function NavBar() {
    const {modalStore, userStore: {user, isLoggedIn, logout}} = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight: 10}}/>
                    Начало
                </Menu.Item>
                <Menu.Item as={NavLink} to='/announcements' name='Новини' />
                <Menu.Item as={NavLink} to='/activities' name='Ръководство' />
                <Menu.Item as={NavLink} to='/activities' name='Състезатели' />
                <Menu.Item as={NavLink} to='/activities' name='История' />
                <Menu.Item as={NavLink} to='/activities' name='Контакти' />

                <Menu.Item position='right'>
                    {isLoggedIn ? (
                        <Dropdown pointing='top left' text={user?.displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text='Профил' icon='user' />
                                <Dropdown.Item onClick={logout} text='Изход' icon='power' />
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Menu.Item>
                            <Button onClick={() => modalStore.openModal(<LoginForm />)}>
                                Вход
                            </Button>
                        </Menu.Item>
                    )}       
                </Menu.Item>
            </Container>
        </Menu>
    )
})