import { FC } from 'react'
import './HeadTitle.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const HeadTitle: FC = () => (
    <Container className="head">
        <Row id="head-title-row"><a href={`/`} id="head-title">Получатели</a></Row>
        <Row id="head-subtitle-row"><a href={`/`} id="head-subtitle">Выберите получателей для отправки им файлов</a></Row>
    </Container>
)

export default HeadTitle