import { observer } from "mobx-react-lite"
import { Button, Container, Divider, Grid, Header, Icon, Segment } from "semantic-ui-react"
import NavBar from "../../app/layout/NavBar"

export default observer(function ContactsPage() {
    return (
        <Segment textAlign='center'>
            <NavBar />
            <Grid>
                <Grid.Column width='10'>
                    <Header as='h1'>
                        Местоположение
                    </Header>
                    <iframe
                        className="responsive-iframe"
                        width="600"
                        height="350"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=27.464833259582523%2C42.51085785981971%2C27.471731901168827%2C42.51349141939854&amp;layer=mapnik&amp;marker=42.51217465348022%2C27.46828258037567"
                    ></iframe>
                    <br />
                    <Button
                        href="https://www.openstreetmap.org/?mlat=42.51217&amp;mlon=27.46828#map=18/42.51217/27.46828&amp;layers=N"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Уголеми картата
                    </Button>
                </Grid.Column>
                <Grid.Column width='6'>
                    <Header as='h1'>
                        За връзка с нас:
                    </Header>
                    <Divider/>
                    <span><Icon name='mail'></Icon> chessburgas64@gmail.com</span>
                    <Divider/>
                    <span><Icon name='phone'></Icon> 0888 454 034 - Живко Жеков</span>
                    <Divider/>
                    <span><Icon name='phone'></Icon> 0899 941 257 - Желчо Желев</span>
                    <Divider/>
                </Grid.Column>
            </Grid>
        </Segment>
    );
});