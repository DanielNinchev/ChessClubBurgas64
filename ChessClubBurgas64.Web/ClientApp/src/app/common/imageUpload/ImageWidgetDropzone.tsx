import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface Props {
    setFiles: (files: any) => void;
    initialImage?: string;
}

export default function ImageWidgetDropzone({ setFiles, initialImage }: Props) {
    const [initialFile, setInitialFile] = useState<any>(null);

    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: '200px'
    };

    const dzActive = {
        borderColor: 'green',
    };

    const onDrop = useCallback((acceptedFiles: any) => {
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        setInitialFile(null); // Clear the initial image
    }, [setFiles]);

    useEffect(() => {
        if (initialImage && !initialFile) {
            const file = {
                preview: initialImage
            };
            setInitialFile(file);
            setFiles([file]);
        }
    }, [initialImage, initialFile, setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' />
            <Header content='Пуснете снимката тук или кликнете за добавяне от устройството Ви' />
        </div>
    );
}