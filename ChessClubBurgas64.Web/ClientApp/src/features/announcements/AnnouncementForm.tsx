import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/MyTextInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnnouncementFormValues } from "../../app/models/announcement";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import LoadingComponent from "../../app/layout/LoadingComponent";
import MyTextArea from "../../app/common/MyTextArea";
import MyDateInput from "../../app/common/MyDateInput";

export default observer(function AnnouncementForm() {
    const { announcementStore } = useStore();
    const { createAnnouncement, updateAnnouncement, loadAnnouncement, loadingInitial } = announcementStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [announcement, setAnnouncement] = useState<AnnouncementFormValues>(new AnnouncementFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('Заглавието е задължително!'),
        description: Yup.string().required('Описанието е задължително!'),
        date: Yup.string().required('Датата е задължителна').nullable(),
        text: Yup.string().required('Съдържанието е задължително!'),
    })

    useEffect(() => {
        if (id) loadAnnouncement(id).then(announcement => setAnnouncement(new AnnouncementFormValues(announcement)))
    }, [id, loadAnnouncement])

    function handleFormSubmit(announcement: AnnouncementFormValues) {
        if (!announcement.id) {
            let newAnnouncement = {
                ...announcement,
                id: uuid()
            }
            createAnnouncement(newAnnouncement).then(() => navigate(`/announcements/${newAnnouncement.id}`))
        } else {
            updateAnnouncement(announcement).then(() => navigate(`/announcements/${announcement.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане на новината...' />

    return (
        <Segment clearing>
            <Header content='Подробности за новината' sub color='teal' />
            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={announcement}
                onSubmit={values =>  handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Заглавие' />
                        <MyTextArea rows={3} name='description' placeholder='Описание' />
                        <MyDateInput name='date' placeholderText='Дата' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />
                        <MyTextArea rows={5} name='text' placeholder='Съдържание' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated='right' 
                            positive 
                            type='submit' 
                            content='Submit' />
                        <Button as={Link} to='/announcements' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})