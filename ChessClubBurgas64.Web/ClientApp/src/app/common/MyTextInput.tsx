import {useField} from "formik";
import {Form, Label} from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
    input?: string;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);
    const value = props.input !== undefined ? props.input : field.value;
    
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <input {...field} {...props} value={value}/>
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
