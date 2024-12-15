import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
    aspectRatio?: number;
}

export default function ImageWidgetCropper({ imagePreview, setCropper, aspectRatio }: Props) {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            initialAspectRatio={aspectRatio || NaN}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    )
}
