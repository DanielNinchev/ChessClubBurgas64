import { useField, useFormikContext } from 'formik';
import { useEffect } from 'react';
import ImageUploadWidget from './imageUpload/ImageUploadWidget';

interface Props {
    name: string;
    label?: string;
    loading: boolean;
    uploadImage: (file: Blob) => void;
    setFiles: (files: Blob[]) => void;
    initialImage?: string;
}

const MyImageUpload = ({ name, label, loading, uploadImage, setFiles, initialImage }: Props) => {
    const [field, meta, helpers] = useField(name);
    const { setValue } = helpers;
    const { values } = useFormikContext<any>();

    useEffect(() => {
        setValue(values.files);
    }, [initialImage, values.files, setValue]);

    return (
        <div>
            {label && <label>{label}</label>}
            <ImageUploadWidget 
                loading={loading} 
                uploadImage={(file: Blob) => {
                    uploadImage(file);
                    setFiles([file]);
                    setValue([file]);
                }} 
                setFiles={setFiles} 
                initialImage={initialImage}
            />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default MyImageUpload;