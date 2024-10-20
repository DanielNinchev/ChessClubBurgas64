import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile
}

export default observer(function ProfileContent({ profile }: Props) {
    const {profileStore} = useStore();

    const panes = [
        { menuItem: 'Име', render: () => <profile.displayName /> },
        { menuItem: 'Акаунт', render: () => <profile.email /> }
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
})
