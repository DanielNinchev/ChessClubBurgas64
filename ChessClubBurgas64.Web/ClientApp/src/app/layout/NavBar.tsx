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
                <Menu.Item as={NavLink} to='/'>
                    <img src='/images/logo.png' alt='logo' style={{marginRight: 7}}/>
                    Начало
                </Menu.Item>
                <Menu.Item as={NavLink} icon='newspaper' to='/announcements' name='Новини' />
                <Menu.Item as={NavLink} icon='users' to='/activities' name='Ръководство' />
                <Menu.Item as={NavLink} icon='chess board' to='/activities' name='Състезатели' />
                <Menu.Item as={NavLink} icon='book' to='/activities' name='История' />
                <Menu.Item as={NavLink} icon='phone' to='/activities' name='Контакти' />

                <Menu.Item position='right'>
                    {isLoggedIn ? (
                        <Dropdown pointing='top left' text={user?.firstName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profiles/${user?.firstName}`} text='Профил' icon='user circle' />
                                <Dropdown.Item onClick={logout} text='Изход' icon='power' />
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Menu inverted>
                            <Menu.Item as={NavLink} icon= 'user' name='Вход' onClick={() => modalStore.openModal(<LoginForm />)}/>
                            <Menu.Item as={NavLink} icon= 'user' name='Регистрация' onClick={() => modalStore.openModal(<RegisterForm />)}/>
                        </Menu>
                    )}       
                </Menu.Item>
            </Container>
        </Menu>
    )
})