import { Box, FormHelperText, FormLabel } from '@mui/material';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import SunEditorComponent from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

type Props<T extends FieldValues> = {
    label: string;
} & UseControllerProps<T>;

export default function SunEditor<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });

    return (
        <Box>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                {props.label}
            </FormLabel>
            <SunEditorComponent
                defaultValue={field.value || ''}
                onChange={(content: string) => field.onChange(content)}
                setOptions={{
                    height: '300px',
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike'],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list'],
                        ['table', 'link', 'image'],
                        ['fullScreen', 'preview'],
                    ],
                }}
            />
            {fieldState.error && (
                <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
        </Box>
    );
}