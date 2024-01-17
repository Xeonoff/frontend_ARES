import { FC } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import "./OrderTable.css"


interface Request {
    pk: number,
    send: string,
    created: string,
    closed: string,
    status: string,
    eventstatus: string,
    username: string,
}

interface Props {
    requests: Request[]
    is_moderator: boolean,
    processStatusUpdate: (id: number, new_status: 'A' | 'W') => Promise<any>
}

const getStatusColor = (status: string) => {
    if (status == 'принят') {
        return "rgb(165, 255, 145)"
    } else if (status == 'отклонён') {
        return "rgb(237, 104, 137)"
    } else if (status == 'отправлен') {
        return "rgb(250, 246, 136)"
    } else {
        return "white"
    }
}

const OrderTable: FC<Props> = ({ requests, is_moderator, processStatusUpdate }) => {
    return (
        <Container id="order-table" style={{ marginTop: "20px", marginBottom: "50px", width: "100%", position: "relative"}}>
            {is_moderator && is_moderator === true? 
            <Row className="order-table-header" style={{ display: "flex", backgroundImage:"url('/src/assets/back1.jpg')"}}>
                <Col className="order-table-head" style={{ width: "10%", borderRight:"solid"}}><h2>Номер</h2></Col>
                <Col className="order-table-head" style={{ width: "18%", borderRight:"solid" }}><h2>Пользователь</h2></Col>
                <Col className="order-table-head" style={{ width: "15%", borderRight:"solid" }}><h2>Создано</h2></Col>
                <Col className="order-table-head" style={{ width: "15%", borderRight:"solid" }}><h2>Отправлено</h2></Col>
                <Col className="order-table-head" style={{ width: "15%", borderRight:"solid" }}><h2>Завершено</h2></Col>
                <Col className="order-table-head" style={{ width: "20%", borderRight:"solid" }}><h2>Статус рассмотрения</h2></Col>
                <Col className="order-table-head" style={{ width: "15%", borderRight:"solid" }}><h2>Статус отправки</h2></Col>
                <Col className="order-table-head" style={{ width: "15%" }}><h2>Ссылка</h2></Col> 
            </Row>
            : 
            <Row className="order-table-header" style={{ display: "flex", padding: "15px" }}>
                <Col className="order-table-head" style={{ width: "10%" }}><h2>Номер</h2></Col>
                <Col className="order-table-head" style={{ width: "15%" }}><h2>Создано</h2></Col>
                <Col className="order-table-head" style={{ width: "18%" }}><h2>Сформировано</h2></Col>
                <Col className="order-table-head" style={{ width: "15%" }}><h2>Завершено</h2></Col>
                <Col className="order-table-head" style={{ width: "20%" }}><h2>Статус рассмотрения</h2></Col>
                <Col className="order-table-head" style={{ width: "15%" }}><h2>Итог соревнований</h2></Col>
                <Col className="order-table-head" style={{ width: "10%" }}><h2>Ссылка</h2></Col>
            </Row>}
            {requests.map((request) => (
                <Row className="order-table-row" key={request.pk} style={{ display: "flex", padding: "10px", backgroundColor: `${getStatusColor(request.status)}`, borderTop: "2px groove black" }}>
                    <Col className="order-table-col" style={{ width: "10%" }}><h2>{request.pk}</h2></Col> 
                    {is_moderator === true && <Col className="order-table-col" style={{ width: "18%" }}><h2>{request.username}</h2></Col>}
                    <Col className="order-table-col" style={{ width: "15%" }}><h2>{request.created}</h2></Col>
                    <Col className="order-table-col" style={{ width: "15%" }}><h2>{request.send}</h2></Col>
                    <Col className="order-table-col" style={{ width: "15%" }}><h2>{request.closed}</h2></Col>
                    <Col className="order-table-col" style={{ width: "20%" }}><h2>{request.status}</h2></Col>
                    <Col className="order-table-col" style={{ width: "15%" }}><h2>{request.eventstatus}</h2></Col>
                    <Col className="order-table-col" style={{ width: "15%", display: "flex", flexDirection: "column" }}>
                        <a href={`/orders/${request.pk}`}><h2>просмотр</h2></a>
                        {is_moderator && request.status == 'отправлен' && 
                        <div style={{ display: "flex" }}>
                            <button className="accept-button" onClick={() => processStatusUpdate(request.pk, 'A')}>Принять</button>
                            <button className="reject-button" onClick={() => processStatusUpdate(request.pk, 'W')}>Отклонить</button>
                        </div>}
                    </Col>
                </Row>
            ))}
        </Container>
    )
}

export default OrderTable;