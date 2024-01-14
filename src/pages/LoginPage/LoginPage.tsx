import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs"
import Loader from '../../components/Loader/Loader.tsx';

import { Container, Row, Col, Card } from "react-bootstrap"
import "./LoginPage.css"


const LoginPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const { login, auth } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: any) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const flag = await login(formData)
        if (flag) {
            navigate("/products")
        }
    }

    const handleAuth  = async () => {
        const flag = await auth()
        if (flag) {
            navigate("/products")
        }
    }

    useEffect(() => {
        handleAuth().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, []);

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row>
                {<Breadcrumbs pages={[ { link: `/login`, title: "Вход" } ]} />}
            </Row>
            <Row>
                <Card style={{ width: "100%", marginRight: "30px", backgroundImage: "url('/src/assets/back1.jpg')", borderRadius: "10px"}}>
                <Container style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Row style={{ display: "flex" }}>
                        <h1 style={{ fontSize: "36px", fontWeight: "500" }}>Вход в аккаунт</h1>
                        <a href="/register" className="form-link"><h3><button id="login-button" className="EntButton" type="submit">Регистрация</button></h3></a>
                    </Row>
                    <form onSubmit={ handleLogin } id="login-form" style={{ marginTop: "30px" }}>
                        <Row>
                            <Col className="left-col">
                                <h3>Имя пользователя</h3>
                            </Col>
                            <Col className="right-col">
                                <input type="text" className="input-login" name="username" placeholder="Введите имя пользователя" required />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="left-col">
                                <h3>Пароль</h3>
                            </Col>
                            <Col className="right-col">
                                <input type="password" className="input-password" name="password" placeholder="Введите пароль" required />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="left-col"></Col>
                            <Col className="right-col">
                                <button id="login-button" className="EntButton" type="submit">Войти</button>
                            </Col>
                        </Row>
                    </form>
                </Container>
                </Card>
            </Row>
        </Container>
        }</>
    )
}

export default LoginPage;