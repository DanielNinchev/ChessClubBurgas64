import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import { Image as AnnouncementImage, Announcement } from "../../app/models/announcement";
import { useStore } from "../../app/stores/store";
import ImageUploadWidget from "../../app/common/imageUpload/ImageUploadWidget";

interface Props {
    announcement: Announcement
}

export default observer(function AnnouncementImages({ announcement }: Props) {
    const { announcementStore: { uploadImage, uploading, setMainImage, loading, deleteImage } } = useStore();
    const [addImageMode, setAddImageMode] = useState(false);
    const [target, setTarget] = useState('');
    const [files, setFiles] = useState<Blob[]>([]);

    function handleImageUpload(file: any) {
        uploadImage(file).then(() => setAddImageMode(false));
    }

    function handleSetMain(image: AnnouncementImage, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainImage(image);
    }

    function handleDeleteImage(image: AnnouncementImage, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deleteImage(image);
    }

    function handleSetFiles(files: Blob[]){
        setFiles(files);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width='16'>
                    <Header floated='left' icon='image' content='Photos' />
                    <Button floated='right' basic content={addImageMode ? 'Отказ' : 'Добавяне'} onClick={() => setAddImageMode(!addImageMode)} />
                </Grid.Column>
                <Grid.Column width='16'>
                    {addImageMode ? (
                        <ImageUploadWidget uploadImage={handleImageUpload} loading={uploading} setFiles={handleSetFiles}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {announcement.images?.map(image => (
                                <Card key={image.id}>
                                    <Image src={image.url} />
                                    <Button.Group fluid widths={2}>
                                        <Button
                                            basic
                                            color='green'
                                            content='Заглавна'
                                            name={'main' + image.id}
                                            loading={target === 'main' + image.id && loading}
                                            disabled={image.isMain}
                                            onClick={e => handleSetMain(image, e)}
                                        />
                                        <Button
                                            name={image.id}
                                            loading={loading && image.id === target}
                                            onClick={(e) => handleDeleteImage(image, e)}
                                            basic
                                            color='red'
                                            icon='trash'
                                            disabled={image.isMain}
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