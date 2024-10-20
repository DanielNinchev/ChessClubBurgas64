import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError";
import MyTextInput from "../../app/common/MyTextInput";

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ firstName: '', middleName: '', lastName: '', email: '', phone: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore.register(values).catch(error => setErrors({ error: error }))}
            validationSchema={Yup.object({
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Регистрация' color="teal" textAlign="center" />
                    <MyTextInput placeholder="E-mail" name='email' />
                    <MyTextInput placeholder="Парола" name='password' type='password' />
                    <MyTextInput placeholder="Повторете паролата" name='repeatPassword' type='password' />
                    <ErrorMessage name='error' render={() => 
                        <ValidationError errors={errors.error} />} />
                    <Button
                        disabled={!isValid || !dirty || isSubmitting} 
                        loading={isSubmitting} 
                        positive content='Регистрирай' 
                        type="submit" fluid 
                    />
                </Form>
            )}

        </Formik>
    )
})