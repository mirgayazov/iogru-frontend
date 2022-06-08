import styled from "styled-components";
import {Accordion, Button, Card, Container, ListGroup, Nav, Navbar, Spinner} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import {authApi} from "./api/auth-api";
import {CreateUser} from "./components/Forms/CreateUser";
import {usersApi} from "./api/users-api";
import User from "./components/User/User";
import {UpdateUser} from "./components/Forms/UpdateUser";
import Timer from "./components/Timer/Timer";

const Block = styled.div`
  margin: 3%;
`;

const Row = styled.div`
  gap: 10px;
  display: grid;
  grid-template-areas: "list form";
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;

  @media ${`(max-width: 740px)`} {
    grid-template-areas: 
            "list"
            "form";
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
  };
`;

export let updateToken = () => {
};

const App = () => {
    const [token, setToken] = useState(localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN));
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    updateToken = setToken;

    useEffect(() => {
        login();
    }, [])

    const onDelete = (id) => {
        let filtered = users.filter((user) => user._id !== id);

        if  (currentUser) {
            if (currentUser._id === id) {
                setCurrentUser(null);
            }
        }

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
            <Navbar bg={'light'} sticky={'top'}>
                <Container fluid>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                            navbarScroll
                        >
                        </Nav>
                        <Timer token={token}/>
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
                    Имитация авторизации (README)
                </Card.Header>
                <Card.Body>
                    <ol>
                        <li>
                            <Card.Text>
                                При входе в приложение, Вы автоматически проходите процедуру "авторизации",
                                сервер в ответ на запрос отправляет Ваш JWT токен, клиент его сохраняет для
                                последующих защищенных запросов.
                            </Card.Text>
                        </li>
                        <li>
                            <Card.Text>
                                Для проверки факта отклонения сервером запросов без токена (либо с
                                просроченным
                                токеном), Вы можете нажать кнопку "Выйти", которая удаляет текущий токен с
                                клиента.
                            </Card.Text>
                        </li>
                        <li>
                            <Card.Text>
                                После выхода, Вы можете вновь "авторизоваться" и получить свой токен, нажав на
                                кнопку "Авторизоваться".
                            </Card.Text>
                        </li>
                        <li>
                            <Card.Text>
                                Любой авторизованный запрос обновляет токен, жизнь токена Вы можете мониторить
                                в разделе
                                меню.
                            </Card.Text>
                        </li>
                    </ol>
                </Card.Body>
            </Card>
            <br/>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Ваш текущий JWT токен</Accordion.Header>
                    <Accordion.Body className={'text-break'}>
                        {token ? token : 'Авторизуйтесь для того чтобы получить токен.'}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <br/>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Создание пользователя</Accordion.Header>
                    <Accordion.Body>
                        <CreateUser addUser={(user) => setUsers([...users, user])}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <br/>
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
    );
}

export default App;

