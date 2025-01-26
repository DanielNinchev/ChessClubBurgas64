import { useEffect, useState } from 'react';
import { Button, Grid, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ImageWidgetDropzone from './ImageWidgetDropzone';
import ImageWidgetCropper from './ImageWidgetCropper';

interface Props {
    loading: boolean;
    uploadImage: (file: Blob) => void;
    setFiles: (files: Blob[]) => void;
    initialImage?: string;
}

export default observer(function ImageUploadWidget({ loading, uploadImage, setFiles, initialImage }: Props) {
    const [files, setLocalFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => {
                if (blob) { 
                    uploadImage(blob); 
                    setFiles([blob]);
                }
            });
        }
    }

    useEffect(() => {
        if (initialImage && files.length === 0) {
            setLocalFiles([{ preview: initialImage }]);
        }
    }, [initialImage, files.length]);

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <>
            <Grid centered>
                <Grid.Row />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='1. Добавяне на снимка' />
                    <ImageWidgetDropzone setFiles={setLocalFiles} />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header sub color='teal' content='2. Преоразмеряване на снимката' />
                    {files && files.length > 0 &&
                        <ImageWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    }
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header sub color='teal' content='3. Преглед и запазване' />
                    <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
                    {files && files.length > 0 && (
                        <>
                            <Button.Group widths={2}>
                                <Button type="button" loading={loading} onClick={onCrop} positive icon='check' />
                                <Button type="button" disabled={loading} onClick={() => setFiles([])} icon='close' />
                            </Button.Group>
                        </>
                    )}
                </Grid.Column>
            </Grid>
        </>
    );
});