import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/MyTextInput";

export default observer(function LoginForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore.login(values).catch(() => setErrors({ error: 'Invalid email or password' }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Влезте в профила си' color="teal" textAlign="center" />
                    <MyTextInput placeholder="Email" name='email' />
                    <MyTextInput placeholder="Парола" name='password' type='password' />
                    <ErrorMessage name='error' render={() => 
                        <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />} />
                    <Button loading={isSubmitting} positive content='Вход' type="submit" fluid />
                </Form>
            )}

        </Formik>
    )
})