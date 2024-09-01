import { Message } from "semantic-ui-react";

interface Props {
    errors: any;
}

export default function ValidationError({errors}: Props) {
    console.log(errors)
    console.log(typeof errors); // Should log 'object' if it's an array
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((err: string, i: any) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}