import { Container, Divider, Header, Segment } from "semantic-ui-react";
import { observer } from 'mobx-react-lite';
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import DOMPurify from 'dompurify';

export default observer(function AnnouncementDetails() {
    const { announcementStore } = useStore();
    const { selectedAnnouncement: announcement, loadAnnouncement, loadingInitial, clearSelectedAnnouncement } = announcementStore;
    const { id } = useParams();

    useEffect(() => {
        if (id) loadAnnouncement(id);
        return () => clearSelectedAnnouncement();
    }, [id, loadAnnouncement, clearSelectedAnnouncement]);

    if (loadingInitial || !announcement) return <LoadingComponent />

    return (
        <Segment>
            <Header textAlign='center' as='h1'>{announcement.title}</Header>
            <Divider/>
            <Container textAlign="justified" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.text) }}></Container>
        </Segment>
    )
})