import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Divider, Dropdown, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/MyTextInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PuzzleFormValues } from "../../app/models/puzzle";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import LoadingComponent from "../../app/layout/LoadingComponent";
import MyImageUpload from "../../app/common/MyImageUpload";

export default observer(function PuzzleForm() {
    const difficultyOptions = [
        { key: '1', text: 'Първо ниво - за начинаещи', value: 'Начинаеща' },
        { key: '2', text: 'Второ ниво - ниска трудност', value: 'Ниска' },
        { key: '3', text: 'Трето ниво - средна трудност', value: 'Средна' },
        { key: '4', text: 'Четвърто ниво - висока трудност', value: 'Висока' },
        { key: '5', text: 'Пето ниво - майсторски', value: 'Майсторска' },
      ]
    const { puzzleStore } = useStore();
    const { createPuzzle, updatePuzzle, loadPuzzle, loadingInitial, uploading } = puzzleStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [puzzle, setPuzzle] = useState<PuzzleFormValues>(new PuzzleFormValues());
    const [files, setFiles] = useState<Blob[]>([]);
    const validationSchema = Yup.object({
        title: Yup.string(),//.required('Заглавието е задължително!'),
        description: Yup.string(),//.required('Условието е задължително!'),
        solution: Yup.string(),//.required('Решението е задължително!'),
        points: Yup.number(),//.required('Точките са задължителни!'),
        difficulty: Yup.string(),//.required('Трудността е задължителна!'),
        image: Yup.object(),//.required('Изображението на задачата е задължително!')
    })

    useEffect(() => {
        if (id) loadPuzzle(Number(id)).then(puzzle => setPuzzle(new PuzzleFormValues(puzzle)))
    }, [id, loadPuzzle])

    function handleFormSubmit(puzzle: PuzzleFormValues) {
        if (!puzzle.id) {
            let newPuzzle = {
                ...puzzle
            }
            createPuzzle(newPuzzle, files[0]).then((response) => navigate(`/puzzles/${response.id}`));
        } else {
            console.log("The number of files is", files.length)
            console.log("The current puzzle is ", puzzle)
            updatePuzzle(puzzle, files[0]).then(() => navigate(`/puzzles/${puzzle.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане на задачата...' />

    return (
        <Segment clearing>
            <Header as='h2' content='Подробности за задачата' color='teal' textAlign="center"/>
            <Divider />
            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={puzzle}
                onSubmit={values =>  handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Задача № ...' label='Пореден номер на задачата' />
                        <MyTextInput name='description' placeholder='Условие на задачата' label='Условие'/>
                        <Dropdown name='difficulty' placeholder='Трудност на задачата' search selection options={difficultyOptions}/>
                        <MyTextInput name='points' placeholder='Точки при правилно решение' label='Точки'/>
                        <MyTextInput name='solution' placeholder='Решение на задачата (видимо е само за администраторите)' label='Решение'/>
                        <MyImageUpload name='image' label='Позиция' loading={uploading} uploadImage={(file: Blob) => setFiles([file])} setFiles={setFiles} initialImage={puzzle.imageUrl}/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated='right' 
                            positive 
                            type='submit' 
                            content='Публикуване' />
                        <Button as={Link} to='/puzzles' floated='right' type='button' content='Отказ' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})