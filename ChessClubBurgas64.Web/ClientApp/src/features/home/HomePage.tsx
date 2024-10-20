import { observer } from 'mobx-react-lite';
import { Container, Header, Segment, Image } from "semantic-ui-react";
import NavBar from '../../app/layout/NavBar';
import '../../app/layout/styles.css';

export default observer(function HomePage() {
    return (
        <Segment textAlign='center' vertical>
            <NavBar/>
            <Container text className='primary-container'>
                <Image src='/images/logo.png' centered id='home-logo'/>
                <Header as='h1' textAlign='center' inverted id= 'home-title'>
                    ШАХМАТЕН КЛУБ ,,БУРГАС-64''
                </Header>
            </Container>
        </Segment>
    )
})