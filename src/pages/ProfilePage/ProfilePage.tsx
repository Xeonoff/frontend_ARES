import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs"

import { Container, Row } from "react-bootstrap"
import "./ProfilePage.css"

const ProfilePage: FC = () => {
    const navigate = useNavigate()
    const { logout, username } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate("/products")
    }

    return (
        <Container>
            <Row>
                {<Breadcrumbs pages={[ { link: `/profile`, title: `профиль ${username}` } ]} />}
            </Row>
            <Row style={{ marginLeft: "30px", marginTop: "40px" }}>
                <h1 style={{ fontWeight: "500" }}>{ `Профиль: ${ username }`}</h1>
                <button id="logout-button" onClick={ handleLogout }>Выйти</button>
            </Row>
        </Container>
    )
}

export default ProfilePage