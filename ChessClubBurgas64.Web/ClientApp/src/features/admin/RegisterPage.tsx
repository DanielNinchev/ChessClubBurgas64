import { Container, Header, Segment, Image } from "semantic-ui-react"
import NavBar from "../../app/layout/NavBar"
import { observer } from "mobx-react-lite"

export default observer(function RegisterPage() {
    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <NavBar/>
            <Container text>
                <Header as='h1' inverted >
                    <Image size='large' src='/android-chrome-512x512.png' alt='logo' style={{ marginBottom: 12 }} />
                    ШАХМАТЕН КЛУБ "БУРГАС 64"
                </Header>
            </Container>
        </Segment>
    )
})