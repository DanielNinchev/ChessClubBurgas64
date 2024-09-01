import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { PagingParams } from '../../app/models/pagination';
import AnnouncementListItemPlaceholder from './AnnouncementListItemPlaceHolder';
import AnnouncementList from './AnnouncementList';
import AnnouncementFilters from './AnnouncementFilters';

export default observer(function AnnouncementDashboard() {
    const { announcementStore } = useStore();
    const { loadActivities, setPagingParams, pagination } = announcementStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        loadActivities();
    }, [loadActivities])

    return (
        <Grid>
            <Grid.Column width='10'>
                {announcementStore.loadingInitial && !loadingNext ? (
                    <>
                        <AnnouncementListItemPlaceholder />
                        <AnnouncementListItemPlaceholder />
                    </>
                ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <AnnouncementList />
                        </InfiniteScroll>
                    )}
            </Grid.Column>
            <Grid.Column width='6'>
                <AnnouncementFilters />
            </Grid.Column>
            <Grid.Column width='10'>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})
