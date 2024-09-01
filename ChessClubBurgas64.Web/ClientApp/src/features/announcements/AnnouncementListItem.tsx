import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Item, Button, Icon, Segment } from "semantic-ui-react";
import { Announcement } from "../../app/models/announcement";

interface Props {
    announcement: Announcement
}

export default function AnnouncementListItem({ announcement }: Props) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular 
                            src={'/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/announcements/${announcement.id}`}>
                                {announcement.title}
                            </Item.Header>
                            <Item.Description>Item description</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(announcement.date!, 'dd MMM yyyy h:mm aa')}
                </span>
            </Segment>
            <Segment clearing>
                <span>{announcement.description}</span>
                <Button
                    as={Link}
                    to={`/announcements/${announcement.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}