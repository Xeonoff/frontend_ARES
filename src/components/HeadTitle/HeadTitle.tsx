import { FC } from 'react'
import './HeadTitle.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const HeadTitle: FC = () => (
    <Container className="head">
        <Row id="head-title-row"><a href={`/`} id="head-title">Правила</a></Row>
        <Row id="head-subtitle-row"><a href={`/`} id="head-subtitle">Выберите правила для просмотра или реадкирования или создайте новое</a></Row>
    </Container>
)

export default HeadTitle