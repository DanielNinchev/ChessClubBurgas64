import { observer } from 'mobx-react-lite';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

export default observer(function AnnouncementFilters() {
    const {announcementStore: {predicate, setPredicate}} = useStore();
    return (
        <>
            <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
                <Header icon='filter' attached color='teal' content='Търси по избран филтър' />
                <Menu.Item
                    content='Всички новини'
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all', 'true')}
                />
            </Menu>
            <Header />
            <Calendar
                onChange={(date: any) => setPredicate('startDate', date as Date)} locale="bg-BG"
            />
        </>
    )
})
