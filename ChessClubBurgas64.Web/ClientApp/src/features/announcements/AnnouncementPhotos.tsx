import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Announcement } from "../../app/models/announcement";
import { useStore } from "../../app/stores/store";

interface Props {
    announcement: Announcement
}

export default observer(function AnnouncementPhotos({ announcement }: Props) {
    const { announcementStore: { uploadPhoto, uploading,
        setMainPhoto, loading, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlePhotoUpload(file: any) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMain(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }


    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width='16'>
                    <Header floated='left' icon='image' content='Photos' />
                    <Button floated='right' basic content={addPhotoMode ? 'Отказ' : 'Добавяне'} onClick={() => setAddPhotoMode(!addPhotoMode)} />
                </Grid.Column>
                <Grid.Column width='16'>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {announcement.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    <Button.Group fluid widths={2}>
                                        <Button
                                            basic
                                            color='green'
                                            content='Заглавна'
                                            name={'main' + photo.id}
                                            loading={target === 'main' + photo.id && loading}
                                            disabled={photo.isMain}
                                            onClick={e => handleSetMain(photo, e)}
                                        />
                                        <Button
                                            name={photo.id}
                                            loading={loading && photo.id === target}
                                            onClick={(e) => handleDeletePhoto(photo, e)}
                                            basic
                                            color='red'
                                            icon='trash'
                                            disabled={photo.isMain}
                                        />
                                    </Button.Group>
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})