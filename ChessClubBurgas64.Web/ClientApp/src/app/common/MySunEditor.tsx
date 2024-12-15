import React, { useEffect, useRef } from 'react';
import { useField } from 'formik';
import 'suneditor/dist/css/suneditor.min.css';
import suneditor from 'suneditor';
import {align, font, fontColor, fontSize, hiliteColor, image, link, list, video} from 'suneditor/src/plugins'

interface Props {
    name: string;
    label?: string;
}

const MySunEditor: React.FC<Props> = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const editor = suneditor.create(editorRef.current!, {
            height: '500',
            plugins: [align, font, fontColor, fontSize, hiliteColor, image, link, list, video],
            buttonList: [
                ['undo', 'redo', 'bold', 'underline', 'italic', 'strike', 'list', 'align', 'font', 'fontColor', 'fontSize', 'hiliteColor', 'link', 'image', 'video']
            ],
        });

        editor.onChange = (contents: string) => {
            helpers.setValue(contents);
        };

        return () => {
            editor.destroy();
        };
    }, [helpers]);

    return (
        <div>
            {label && <label>{label}</label>}
            <div ref={editorRef} />
            {meta.touched && meta.error ? (
                <div className="ui pointing red basic label">{meta.error}</div>
            ) : null}
        </div>
    );
};

export default MySunEditor;
