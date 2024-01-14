import { FC } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import "./OrderTable.css"


interface Request {
    pk: number,
    send: string,
    status: string,
    eventstatus: string
}

interface Props {
    requests: Request[]
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

const OrderTable: FC<Props> = ({ requests }) => {
    return (
        <Container id="order-table" style={{ marginTop: "20px", marginBottom: "50px", width: "86%", position: "relative", left: "7%" }}>
            <Row className="order-table-header" style={{ display: "flex", padding: "15px" }}>
                <Col className="order-table-head" style={{ width: "25%" }}><h2>Номер</h2></Col>
                <Col className="order-table-head" style={{ width: "25%" }}><h2>Дата и время отправки</h2></Col>
                <Col className="order-table-head" style={{ width: "25%" }}><h2>Статус рассмотрения</h2></Col>
                <Col className="order-table-head" style={{ width: "25%" }}><h2>Статус отправки</h2></Col>
                <Col className="order-table-head" style={{ width: "25%" }}><h2>Ссылка</h2></Col>
                
            </Row>
            {requests.map((request) => (
                <Row className="order-table-row" key={request.pk} style={{ display: "flex", padding: "15px", backgroundColor: `${getStatusColor(request.status)}`, borderTop: "2px groove black" }}>
                    <Col className="order-table-col" style={{ width: "25%" }}><h2>{request.pk}</h2></Col> 
                    <Col className="order-table-col" style={{ width: "25%" }}><h2>{request.send}</h2></Col>
                    <Col className="order-table-col" style={{ width: "25%" }}><h2>{request.status}</h2></Col>
                    <Col className="order-table-col" style={{ width: "25%" }}><h2>{request.eventstatus}</h2></Col>
                    <Col className="order-table-col" style={{ width: "25%" }}><a href={`/orders/${request.pk}`}><h2>посмотреть</h2></a></Col>
                </Row>
            ))}
        </Container>
    )
}

export default OrderTable;