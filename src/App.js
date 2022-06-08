import styled from "styled-components";
import {Accordion, Button, Card, Container, ListGroup, Nav, Navbar, Spinner} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import {authApi} from "./api/auth-api";
import {CreateUser} from "./components/Forms/CreateUser";
import {usersApi} from "./api/users-api";
import User from "./components/User/User";
import {UpdateUser} from "./components/Forms/UpdateUser";

const Block = styled.div`
  margin: 3%;
`;

const Row = styled.div`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const App = () => {
    const [token, setToken] = useState(localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN));
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const onDelete = (id) => {
        let filtered = users.filter(({_id}) => _id !== id);
        setUsers(filtered);
    }

    const onSelect = (user) => {
        setCurrentUser(null);
        setCurrentUser(user);
    }

    const onUpdate = (updatedUser) => {
        let updated = users.map(user => {
            if (user._id === updatedUser._id) {
                user = {...user, ...updatedUser}
            }
            return user
        })

        setCurrentUser(null);
        setUsers(updated);
    }

    const login = () => {
        setLoading(true);
        authApi.login({/* some user data */})
            .then(response => {
                const {status, data: {access_token}} = response;
                if (status === 201) {
                    setToken(access_token)
                    localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN, access_token)

                    usersApi.getAll()
                        .then(response => {
                            const {status, data} = response;
                            if (status === 200) {
                                setUsers(data)
                                setLoading(false);
                            }
                        })
                }
            })
    }

    const logout = () => {
        localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
        setToken(null);
    }

    return (
        <Block>
            <Block>
                <Navbar>
                    <Container fluid>
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{maxHeight: '100px'}}
                                navbarScroll
                            >
                            </Nav>
                            {!token ?
                                <Button
                                    onClick={login}
                                    variant="outline-primary">
                                    Авторизоваться
                                </Button> :
                                <Button onClick={logout}
                                        variant="outline-danger">
                                    Выйти
                                </Button>
                            }
                            {loading ?
                                <Spinner animation="border" role="status" style={{marginLeft: "10px"}}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                : null}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <br/>
                <Card>
                    <Card.Header className={'align-bottom'} as={"h6"}>
                        Имитация авторизации
                    </Card.Header>
                    <Card.Body>
                        <ol>
                            <li>
                                <Card.Text>
                                    При входе в приложение, Вам необходимо пройти "авторизацию" (нажав на
                                    кнопку
                                    Авторизоваться в правом верхнем углу), после чего сервер сгенерирует Ваш
                                    JWT токен
                                    доступа и Вы сможете
                                    отсылать авторизованные запросы на сервис в течение 15 минут.
                                </Card.Text>
                            </li>
                            <li>
                                <Card.Text>
                                    Токен обновляется при каждом запросе, но, если в течение 15 минут запросы
                                    будут отсутствовать токен умрет и будет необходимо заново авторизоваться.
                                </Card.Text>

                            </li>
                        </ol>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Почему не сделал автоматический запрос на сервер при
                                    запуске
                                    приложения?</Accordion.Header>
                                <Accordion.Body>
                                    Для того, чтобы при входе в приложение Вы могли проверить что запросы
                                    без
                                    токена отклоняются сервером, а уже потом "авторизоваться" и
                                    протестировать
                                    само API.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card.Body>
                </Card>
                <br/>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Ваш JWT токен доступа</Accordion.Header>
                        <Accordion.Body className={'text-break'}>
                            {token ? token : 'Авторизуйтесь для того чтобы получить токен.'}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Block>
            <Block>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Создать пользователя</Accordion.Header>
                        <Accordion.Body>
                            <CreateUser addUser={(user) => setUsers([...users, user])}/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Block>
            <Block>
                <Row>
                    <div>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Пользователи</Accordion.Header>
                                <Accordion.Body>
                                    {users.length ? <ListGroup as="ol" numbered>
                                        {users.map((user) => {
                                            return <User
                                                onDelete={onDelete}
                                                onSelect={onSelect}
                                                user={user}
                                                key={user._id}/>
                                        })}
                                    </ListGroup> : 'Список пользователей пуст, либо Вы не авторизованы'}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Редактирование пользователя</Accordion.Header>
                                <Accordion.Body>
                                    <UpdateUser onUpdate={onUpdate} user={currentUser}/>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Row>
            </Block>
        </Block>
    );
}

export default App;

