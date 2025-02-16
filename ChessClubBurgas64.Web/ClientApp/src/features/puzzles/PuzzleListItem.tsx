import { Link } from "react-router-dom";
import { Item, Button, Icon, Segment, Container, Divider } from "semantic-ui-react";
import { Puzzle } from "../../app/models/puzzle";
import { observer } from "mobx-react-lite";
import { useStore } from '../../app/stores/store';
import React from "react";
import ConfirmationModal from "../users/ConfirmationModal";

interface Props {
    puzzle: Puzzle
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

export default observer(function PuzzleListItem({ puzzle }: Props) {
    const { puzzleStore: { deletePuzzle}, userStore: {user} } = useStore();
    const [state, dispatch] = React.useReducer(reduceState, {
        open: false,
        dimmer: undefined,
      })
    const { open, dimmer } = state  
    const handleConfirm = () => {
        deletePuzzle(puzzle.id);
    };

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='large' 
                            src={puzzle.imageUrl} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/puzzles/${puzzle.id}`}>
                                {puzzle.title}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='star' /> {puzzle.difficulty}
                </span>
            </Segment>
            <Segment clearing>
                <Divider></Divider>     
                <span>{puzzle.difficulty}</span>
                <Divider></Divider>     
                <span>{puzzle.points}</span>
                <Divider></Divider>        
                {user?.isAdmin ? (<Container textAlign="right">
                        <span>Решение: {puzzle.solution}</span>
                        <Divider></Divider>
                        <Button 
                            as={Link} 
                            to={`/puzzles/update/${puzzle.id}`} 
                            color='yellow'
                            icon='edit' 
                            content='Обновяване'
                        >
                        </Button>
                        <Button
                            onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
                            color='red'
                            icon='delete'
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
                    </Container>) : (<></>)
                }              
            </Segment>
        </Segment.Group>
    )
})