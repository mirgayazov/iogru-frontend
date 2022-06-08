import {Formik, Form as FormikForm, Field, ErrorMessage} from 'formik';
import {Button, Card, Form} from 'react-bootstrap';
import * as Yup from "yup";
import {usersApi} from "../../api/users-api";
import {toast} from "react-toastify";

const CreateUserSchema = Yup.object().shape({
    firstName: Yup.string()
        .test('Имя', 'Не более 25 символов', s => s ? s.length < 25 : true)
        .required('Обязательно к заполнению'),
    lastName: Yup.string()
        .test('Фамилия', 'Не более 25 символов', s => s ? s.length < 25 : true)
        .required('Обязательно к заполнению'),
    age: Yup.number()
        .min(0, 'Значение должно быть > 0')
        .max(125, 'Значение должно быть < 125')
        .required('Обязательно к заполнению'),

});

export const CreateUser = (props) => {
    return (
        <Formik
            validationSchema={CreateUserSchema}
            initialValues={{firstName: '', lastName: '', age: ''}}
            onSubmit={(user, helpers) => {
                usersApi.create(user)
                    .then((response) => {
                        const {status, data: user} = response;

                        if (status === 201) {
                            props.addUser(user);
                            toast.success('Пользователь создан', {autoClose: 1500});
                        }
                        helpers.resetForm();
                        helpers.setSubmitting(false);
                    })
                    .catch(() => {
                        toast.warn('Авторизуйтесь', {autoClose: 1500});
                        helpers.setSubmitting(false);
                    })
            }}
        >
            {({isSubmitting}) => (
                <FormikForm>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Имя</Form.Label>
                        <br/>
                        <Card>
                            <Field type="text" name="firstName" placeholder="введите имя..."/>
                            <ErrorMessage name="firstName" component={Card.Footer}/>
                        </Card>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Фамилия</Form.Label>
                        <br/>
                        <Card>
                            <Field type="text" name="lastName" placeholder="введите имя..."/>
                            <ErrorMessage name="lastName" component={Card.Footer}/>
                        </Card>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Возраст</Form.Label>
                        <br/>
                        <Card>
                            <Field type="number" name="age" placeholder="введите возраст..."/>
                            <ErrorMessage name="age" component={Card.Footer}/>
                        </Card>
                    </Form.Group>
                    <Button disabled={isSubmitting}
                            variant="outline-primary" type="submit">
                        Создать
                    </Button>
                </FormikForm>
            )}
        </Formik>
    );
}
