import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Divider, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/MyTextInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnnouncementFormValues } from "../../app/models/announcement";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import LoadingComponent from "../../app/layout/LoadingComponent";
import MyTextArea from "../../app/common/MyTextArea";
import MySunEditor from "../../app/common/MySunEditor";
import MyImageUpload from "../../app/common/MyImageUpload";

export default observer(function AnnouncementForm() {
    const { announcementStore } = useStore();
    const { createAnnouncement, updateAnnouncement, loadAnnouncement, loadingInitial, uploadImage, uploading } = announcementStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState<AnnouncementFormValues>(new AnnouncementFormValues());
    const [files, setFiles] = useState<Blob[]>([]);
    const validationSchema = Yup.object({
        title: Yup.string().required('Заглавието е задължително!'),
        description: Yup.string().required('Описанието е задължително!'),
        text: Yup.string().required('Съдържанието е задължително!'),
        mainImage: Yup.array().min(1, 'Трябва да качите поне една снимка!')
    })

    useEffect(() => {
        if (id) loadAnnouncement(id).then(announcement => setAnnouncement(new AnnouncementFormValues(announcement)))
    }, [id, loadAnnouncement])

    function handleFormSubmit(announcement: AnnouncementFormValues) {
        if (!announcement.id) {
            let newAnnouncement = {
                ...announcement
            }
            createAnnouncement(newAnnouncement, files[0]).then((response) => navigate(`/announcements/${response.id}`));
        } else {
            updateAnnouncement(announcement).then(() => navigate(`/announcements/${announcement.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане на новината...' />

    return (
        <Segment clearing>
            <Header as='h2' content='Подробности за новината' color='teal' textAlign="center"/>
            <Divider />
            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={announcement}
                onSubmit={values =>  handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Заглавието на новината (до 50 символа)' label='Заглавие' />
                        <MyTextArea rows={5} name='description' placeholder='Кратко описание на новината (с няколко изречения)'  label='Описание'/>
                        <MyImageUpload name='mainImage' label='Заглавна снимка' loading={uploading} uploadImage={(file: Blob) => setFiles([file])} setFiles={setFiles} />
                        <MySunEditor name='text' label='Текстово съдържание:'/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated='right' 
                            positive 
                            type='submit' 
                            content='Публикуване' />
                        <Button as={Link} to='/announcements' floated='right' type='button' content='Отказ' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})