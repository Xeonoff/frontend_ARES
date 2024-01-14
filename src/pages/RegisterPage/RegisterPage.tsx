import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs"

import { Container, Row, Col, Card } from "react-bootstrap"
import "./RegisterPage.css"


const RegisterPage: FC = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleRegister = async (e: any) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const response = await register(formData)
        if (response.status == 200) {
            navigate("/login")
        }
    }

    return (
        <Container>
            <Row>
                {<Breadcrumbs pages={[ { link: `/register`, title: "Регистрация" } ]} />}
            </Row>
            <Row>
                <Card style={{ width: "100%", marginRight: "30px", backgroundImage: "url('/src/assets/back1.jpg')", borderRadius: "10px"}}>
                <Container style={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Row style={{ display: "flex" }}>
                        <h1 style={{ fontSize: "36px", fontWeight: "500" }}>Регистрация</h1>
                        <a href="/login" className="form-link"><h3><button id="register-button" className="EntButton" type="submit">Вход в аккаунт</button></h3></a>
                    </Row>
                    <form onSubmit={ handleRegister } id="login-form" style={{ marginTop: "30px" }}>
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
                                <button id="register-button" className="EntButton" type="submit">Зарегистироваться</button>
                            </Col>
                        </Row>
                    </form>
                </Container></Card>
            </Row>
        </Container>
    )
}

export default RegisterPage;