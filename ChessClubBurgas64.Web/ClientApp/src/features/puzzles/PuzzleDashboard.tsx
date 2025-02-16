import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { PagingParams } from '../../app/models/pagination';
import PuzzleListItemPlaceholder from './PuzzleListItemPlaceholder';
import PuzzleList from './PuzzleList';
import { Link } from 'react-router-dom';

export default observer(function PuzzleDashboard() {
    const { puzzleStore, userStore: {user, isLoggedIn} } = useStore();
    const { loadPuzzles: loadPuzzles, setPagingParams, pagination } = puzzleStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadPuzzles().then(() => setLoadingNext(false));

        console.log('Pagination:', pagination)
        console.log('LoadingNext:', loadingNext)
    }

    useEffect(() => {
        loadPuzzles();
    }, [loadPuzzles])

    return (
        <Grid>
            <Grid.Column width='10'>
                { isLoggedIn && user?.isAdmin ? 
                    (<Button as={Link} to='/puzzles/create' float='center' type='button' positive content='Добави задача' />) : (<></>)
                }
                {puzzleStore.loadingInitial && !loadingNext ? (
                    <>
                        <PuzzleListItemPlaceholder />
                        <PuzzleListItemPlaceholder />
                    </>
                ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <PuzzleList />
                        </InfiniteScroll>
                    )}
            </Grid.Column>
            <Grid.Column width='10'>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})
