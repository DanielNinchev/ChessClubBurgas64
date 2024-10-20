import { Checkbox, Form, Label } from 'semantic-ui-react'
import {useField} from "formik";

interface Props {
    label: string;
}

export default function CheckboxContent(props: Props){
    const [field, meta, helpers] = useField(props.label);
    return (
        <Form.Field error={meta.touched && !meta.error}>
            <Checkbox label={props.label} onChange={(e, d) => helpers.setValue(d.value)}/>
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}