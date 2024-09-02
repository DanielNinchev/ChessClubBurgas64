import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Няма открити съвпадения с търсеното от Вас.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities'>
                    Назад
                </Button>
            </Segment.Inline>
        </Segment>
    )
}