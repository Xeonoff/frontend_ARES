import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSsid } from "../../hooks/useSsid";

import { Product } from '../ProductListPage/ProductListPage'
import ProductInfo, { Param } from '../../components/ProductInfo/ProductInfo'

import { Container, Row } from 'react-bootstrap';
import "./ProductPage.css"

import axios from "axios";


const ProductPage: FC = () => {
    const { id } = useParams();

    const [ product, setProduct ] = useState<Product>();
    const [ parameters, setParameters ] = useState<Param[]>([]);

    const { session_id } = useSsid()

    const getParams = (source: Product) => {
        let params: Param[] = []
        source.bdate && params.push({key: "Дата рождения", value: source.bdate})
        source.email && params.push({key: "email", value: source.email})
        source.phone &&  params.push({key: "Телефонный номер", value: source.phone})
        return params
    }

    const getProduct = async () => {
        const { data } = await axios(`/api/receivers/${id}/`, {
                method: "GET",
                headers: {
                    'authorization': session_id
                },
            })
        setProduct(data);
        setParameters(getParams(data));
    }

    useEffect(() => {
        getProduct()
    }, [id]);

    return (
        <Container>
            <Row>
                {product && id && <ProductInfo id={parseInt(id)} full_name={product.full_name} parameters={parameters} img={product.img} />}
            </Row>
        </Container>
    )
}

export default ProductPage;