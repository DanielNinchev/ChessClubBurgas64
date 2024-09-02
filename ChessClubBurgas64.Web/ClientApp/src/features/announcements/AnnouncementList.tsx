import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { Fragment } from 'react/jsx-runtime';
import { Header } from 'semantic-ui-react';
import AnnouncementListItem from './AnnouncementListItem';

export default observer(function AnnouncementList() {
    const { announcementStore } = useStore();
    const { groupedAnnouncements: groupedActivities } = announcementStore;

    return (
        <>
            {groupedActivities.map(([group, announcements]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {announcements && announcements.map(announcement => (
                        <AnnouncementListItem key={announcement.id} announcement={announcement} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})
