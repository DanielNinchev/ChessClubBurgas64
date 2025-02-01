import { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import PuzzleListItem from './PuzzleListItem';

export default observer(function PuzzleList() {
    const { puzzleStore } = useStore();
    const { groupedPuzzles } = puzzleStore;

    return (
        <>
            {groupedPuzzles.map(([group, puzzles]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {puzzles && puzzles.map(puzzle => (
                        <PuzzleListItem key={puzzle.id} puzzle={puzzle} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})