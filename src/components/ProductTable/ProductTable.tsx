import { FC } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import "./ProductTable.css"
import ImageWrapper from '../ImageWrapper/ImageWrapper'


interface ProductTableItem {
    id: number,
    full_name: string,
    file_extension: 'jpg' | 'png',
    status: 'A' | 'N',
    description: string,
    weight: string,
    height: string,
    bdate: string,
    last_modified: string,
    image: string
}

interface Props {
    participants: ProductTableItem[]
    deleteProduct: (id: number) => Promise<any>
}

const ProductTable: FC<Props> = ({ participants, deleteProduct }) => {
    const navigate = useNavigate()

    const getTextStatus = (participant: ProductTableItem) => {
        return (participant.status == 'A' ? 'активен' : 'удалён')
    }

    const getStatusColor = (status: 'A' | 'N') => {
        if (status == 'N'){
            return "rgb(237, 104, 137)"
        }
    }

    return (
        <Container id="product-table" style={{ marginTop: "30px", marginBottom: "50px", width: "95%", marginLeft: "1%" }}>
            <Row className="product-table-header" style={{ display: "flex", padding: "15px" }}>
                <Col className="product-table-head" style={{ width: "20%" }}><h2>ФИО</h2></Col>
                <Col className="product-table-head" style={{ width: "13%" }}><h2>Статус</h2></Col>
                <Col className="product-table-head" style={{ width: "28%" }}><h2>Картинка</h2></Col>
                <Col className="product-table-head" style={{ width: "13%" }}><h2>Действия</h2></Col>
            </Row>
            {participants.map((participant, index) => (
                <Row className="product-table-row" key={index} style={{ display: "flex", padding: "15px", backgroundColor: `${getStatusColor(participant.status)}`, borderTop: "2px groove black" }}>
                    <Col className="product-table-col" style={{ width: "20%" }}><h2>{participant.full_name}</h2></Col> 
                    <Col className="product-table-col" style={{ width: "13%", display: "flex", flexDirection: "column" }}>
                        <h2>{getTextStatus(participant)}</h2>
                        {participant.status == 'N' ?
                        <button className="activate-product-button" onClick={() => deleteProduct(participant.id)}>Вернуть</button> :
                        <button className="delete-product-button" onClick={() => deleteProduct(participant.id)}>Удалить</button>}
                    </Col>
                    <Col className="product-table-col" style={{ width: "28%" }}><div><ImageWrapper className="product-table-image" src={participant.image} based="/default.jpg" /></div></Col>
                    <Col className="product-table-col" style={{ width: "13%", display: "flex", flexDirection: "column" }}>
                        <a href={`/products/${participant.id}`}><h2>посмотреть</h2></a>
                        <button className="update-product-button" onClick={() => navigate(`/products/${participant.id}/update`)}>Изменить</button>
                    </Col>
                </Row>
            ))}
        </Container>
    )
}

export default ProductTable;