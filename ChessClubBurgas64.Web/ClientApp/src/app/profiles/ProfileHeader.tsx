import { observer } from 'mobx-react-lite';
import { Grid, Segment, Item, Header, Statistic, Divider, Button } from "semantic-ui-react";
import { Profile } from '../../app/models/profile';

interface Props {
    profile: Profile
}

export default observer(function ProfileHeader({ profile }: Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Победи' value={44} />
                        <Statistic label='Загуби' value={31} />
                        <Statistic label='Равенства' value={8} />
                    </Statistic.Group>
                    <Divider />
                    <Button profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>

    )
})

