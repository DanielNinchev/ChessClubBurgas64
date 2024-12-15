import { format } from "date-fns";
import { bg } from 'date-fns/locale';
import { Link, useNavigate } from "react-router-dom";
import { Item, Button, Icon, Segment, Container, Divider, ModalHeader, ModalContent, ModalActions, Modal } from "semantic-ui-react";
import { Announcement } from "../../app/models/announcement";
import { observer } from "mobx-react-lite";
import { useStore } from '../../app/stores/store';
import React from "react";
import ConfirmationModal from "../users/ConfirmationModal";

interface Props {
    announcement: Announcement
}

interface State {
    open: boolean;
    dimmer?: 'blurring' | 'inverted' | undefined;
  }
  
interface Action {
    type: 'OPEN_MODAL' | 'CLOSE_MODAL';
    dimmer?: 'blurring' | 'inverted' | undefined;
  }

function reduceState(state: State, action: Action) {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { open: true, dimmer: action.dimmer }
      case 'CLOSE_MODAL':
        return { open: false }
      default:
        throw new Error()
    }
}

export default observer(function AnnouncementListItem({ announcement }: Props) {
    const { announcementStore: { updateAnnouncement, deleteAnnouncement}, userStore: {user} } = useStore();
    const [state, dispatch] = React.useReducer(reduceState, {
        open: false,
        dimmer: undefined,
      })
    const { open, dimmer } = state  
    const handleConfirm = () => {
        deleteAnnouncement(announcement.id);
    };

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='large' 
                            src={announcement.title} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/announcements/${announcement.id}`}>
                                {announcement.title}
                            </Item.Header>
                            <Item.Description>Описание</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(announcement.dateCreated!, "d MMMM yyyy 'г.,' H:mm 'ч.'", { locale: bg })}
                </span>
            </Segment>
            <Segment clearing>
                <span>{announcement.description}</span>
                <Divider></Divider>     
                    {user?.isAdmin ? (<Container textAlign="right">
                            <Button
                                as={Link}
                                to={`/announcements/${announcement.id}`}
                                color='teal'
                                content='Преглед...'
                            />
                            <Button 
                                as={Link} 
                                to={`/announcements/update/${announcement.id}`} 
                                color='yellow' 
                                content='Обновяване'
                            >
                            </Button>
                            <Button
                                onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
                                color='red'
                                content='Изтриване'
                            >
                            </Button>
                            <ConfirmationModal
                                dimmer={dimmer}
                                open={open} 
                                headerContent="Сигурни ли сте, че искате да изтриете тази новина?"
                                modalContent="Изтриването на новината е завинаги и е необратимо. Веднъж изтрита, тя няма да може да бъде възстановена."
                                confirm="Изтриване"
                                deny="Отказ"
                                onConfirm={handleConfirm}
                                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}>
                            </ConfirmationModal>

                        </Container>) : (<Container textAlign="right">
                            <Button
                                as={Link}
                                to={`/announcements/${announcement.id}`}
                                color='teal'
                                content='Преглед...'
                            />
                        </Container>)
                    }              
            </Segment>
        </Segment.Group>
    )
})