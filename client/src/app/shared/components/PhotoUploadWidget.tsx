import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid2, Typography } from "@mui/material";
import "cropperjs/dist/cropper.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { useDropzone } from 'react-dropzone';

type Props = {
    uploadPhoto: (file: Blob) => void
    loading: boolean
}

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
    const [files, setFiles] = useState<object & { preview: string; }[]>([]);
    const cropperRef = useRef<ReactCropperElement>(null);

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file as Blob)
        })))
    }, []);

    const onCrop = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        cropper?.getCroppedCanvas().toBlob(blob => {
            uploadPhoto(blob as Blob)
        })
    }, [uploadPhoto])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <Grid2 container spacing={3}>
            <Grid2 size={4}>
                <Typography variant="overline" color="secondary">
                    Стъпка 1 - Добавете снимка
                </Typography>
                <Box {...getRootProps()}
                    sx={{
                        border: 'dashed 3px #eee',
                        borderColor: isDragActive ? 'green' : '#eee',
                        borderRadius: '5px',
                        paddingTop: '30px',
                        textAlign: 'center',
                        height: '280px',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main' }
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUpload sx={{ fontSize: 80, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                        Пуснете снимка тук
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        или натиснете, за да изберете
                    </Typography>
                </Box>
            </Grid2>
            <Grid2 size={4}>
                <Typography variant="overline" color="secondary">
                    Стъпка 2 - Преоразмерете
                </Typography>
                {files[0]?.preview &&
                    <Cropper
                        src={files[0]?.preview}
                        style={{ height: 300, width: '90%' }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview='.img-preview'
                        guides={false}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                    />}
            </Grid2>
            <Grid2 size={4}>
                {files[0]?.preview && (
                    <>
                        <Typography variant="overline" color="secondary">
                            Стъпка 3 - Преглед и качване
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: 400,
                                    aspectRatio: '1',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={files[0]?.preview}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                            <Box
                                className="img-preview"
                                sx={{
                                    width: '100%',
                                    maxWidth: 400,
                                    height: 400,
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                            <Box display="flex" gap={2}>
                                <Button
                                    onClick={() => setFiles([])}
                                    variant="outlined"
                                >
                                    Назад
                                </Button>
                                <Button
                                    onClick={onCrop}
                                    variant="contained"
                                    color="success"
                                    disabled={loading}
                                >
                                    {loading ? 'Качване...' : 'Качи снимката'}
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Grid2>
        </Grid2>
    )
}