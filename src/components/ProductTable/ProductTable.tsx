import { FC } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import "./ProductTable.css"
import ImageWrapper from '../ImageWrapper/ImageWrapper'


interface ProductTableItem {
    id: number,
    full_name : string,
    status : '1' | '0',
    bdate : string,
    sex : 'm' | 'f' | 'n',
    email : string,
    available_mem : string,
    phone : string,
    last_modified : string,
    img: string
}

interface Props {
    receivers: ProductTableItem[]
    deleteProduct: (id: number) => Promise<any>
}

const ProductTable: FC<Props> = ({ receivers, deleteProduct }) => {
    const navigate = useNavigate()

    const getTextStatus = (receiver: ProductTableItem) => {
        return (receiver.status == '1' ? 'активен' : 'удалён')
    }

    const getStatusColor = (status: '1' | '0') => {
        if (status == '0'){
            return "rgb(237, 104, 137)"
        }
    }

    return (
        <Container id="product-table" style={{ marginTop: "30px", marginBottom: "50px", width: "95%", marginLeft: "1%" }}>
            <Row className="product-table-header" style={{ display: "flex", padding: "15px" }}>
                <Col className="product-table-head" style={{ width: "25%" }}><h2>Имя</h2></Col>
                <Col className="product-table-head" style={{ width: "25%" }}><h2>Статус</h2></Col>
                <Col className="product-table-head" style={{ width: "25%" }}><h2>Картинка</h2></Col>
                <Col className="product-table-head" style={{ width: "25%" }}><h2>Действия</h2></Col>
            </Row>
            {receivers.map((receiver, index) => (
                <Row className="product-table-row" key={receiver.id} style={{ display: "flex", padding: "15px", backgroundColor: `${getStatusColor(receiver.status)}`, borderTop: "2px groove black" }}>
                    <Col className="product-table-col" style={{ width: "25%" }}><h2>{receiver.full_name}</h2></Col> 
                    <Col className="product-table-col" style={{ width: "25%", display: "flex", flexDirection: "column" }}>
                        <h2>{getTextStatus(receiver)}</h2>
                        {receiver.status == '0' ?
                        <button className="activate-product-button" onClick={() => deleteProduct(receiver.id)}>Вернуть</button> :
                        <button className="delete-product-button" onClick={() => deleteProduct(receiver.id)}>Удалить</button>}
                    </Col>
                    <Col className="product-table-col" style={{ width: "25%" }}><div><ImageWrapper className="product-table-image" src={receiver.img} based="/default.jpg" /></div></Col>
                    <Col className="product-table-col" style={{ width: "25%", display: "flex", flexDirection: "column" }}>
                        <a style={{textDecoration: "none", color: "black"}} href={`/products/${receiver.id}`}><h2>посмотреть</h2></a>
                        <button className="update-product-button" onClick={() => navigate(`/products/${receiver.id}/update`)}>Изменить</button>
                    </Col>
                </Row>
            ))}
        </Container>
    )
}

export default ProductTable;