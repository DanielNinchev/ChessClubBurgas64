import { observer } from 'mobx-react-lite';
import { Container, Header, Segment, Image } from "semantic-ui-react";
import NavBar from '../../app/layout/NavBar';

export default observer(function HomePage() {
    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <NavBar/>
            <Container text>
                <Header as='h1' inverted >
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    ШАХМАТЕН КЛУБ "БУРГАС 64"
                </Header>
            </Container>
        </Segment>
    )
})