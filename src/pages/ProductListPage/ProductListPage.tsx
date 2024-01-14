import { FC, useState, useEffect } from 'react';
import { useSsid } from "../../hooks/useSsid.ts";
import { useAuth } from '../../hooks/useAuth.ts';
import { useProductFilter } from '../../hooks/useProductFilter.ts';

import axios from "axios";
import { getDefaultResponse } from '../../assets/MockObjects.ts';

import ProductCard from "../../components/ProductCard/ProductCard.tsx";
import Filter from '../../components/Filter/Filter.tsx';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.tsx';
import Loader from '../../components/Loader/Loader.tsx';
import { updateButton } from '../../store/buttonSlice.ts';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import "./ProductListPage.css";


export interface Product {
    id: number,
    full_name : string,
    img : string,
    status : '1' | '0',
    bdate : string,
    sex : 'm' | 'f',
    email : string,
    available_mem : string,
    phone : string,
    last_modified : string
}

interface Response {
    SendingId: number,
    Receivers: Product[]
}

const ProductListPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const dispatch = useDispatch();
    const [ response, setResponse ] = useState<Response> ({
        SendingId: -1,
        Receivers: [],
    })

    const { cache , searchValue, setCache } = useProductFilter()

    const { session_id } = useSsid()
    const { is_authenticated } = useAuth()

    const getFilteredProducts = async () => {
        try {
            const { data } = await axios(`http://127.0.0.1:8000/receivers/`, {
                method: "GET",
                headers: {
                    'authorization': session_id
                },
                params: {
                    title: searchValue,
                },
                signal: AbortSignal.timeout(1000)
            })
            setResponse(data)
            setCache(data.Receivers)
        } catch (error) {
            setResponse(getDefaultResponse(3, searchValue))
        }
    }
    useEffect(() => {
        if (response.SendingId !== -1) {
            dispatch(updateButton({ SendingId: response.SendingId }));
        }
        console.log(response.SendingId)
    }, [response, dispatch]);

    useEffect(() => {
        getFilteredProducts().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, [])

    const addToCart = async (receiver_id: number) => {
        await axios(`http://localhost:8000/receivers/${receiver_id}/`, {
            method: "POST",
            headers: {
                'authorization': session_id
            },
        })
        await getFilteredProducts()
    }

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row style={is_authenticated ? { position: 'relative', top: '-25px' } : {}}>
                <Breadcrumbs pages={[]} />
            </Row>
            <Row style={is_authenticated ? { display: 'flex', position: 'relative', top: '-25px' } : {display: 'flex'}}>
                <Col style={{ width: "22%", margin: "30px" }}>
                    <Filter
                        send={getFilteredProducts}
                    />
                </Col>
                <Col style={{ marginBottom: "30px", marginLeft: "10px" }}>
                    <div id="box">
                        {console.log(cache)}
                        {cache.map((product: Product) => (
                            is_authenticated ?
                            <div>
                                <ProductCard key={product.id.toString()}
                                    id={product.id}
                                    full_name={product.full_name}
                                    img={product.img}
                                    phone={product.phone}
                                />
                                <button onClick={() => {addToCart(product.id)}} className="main-add-button">➕</button>
                            </div> :
                            <ProductCard key={product.id.toString()}
                                id={product.id}
                                full_name={product.full_name}
                                img={product.img}
                                phone={product.phone}
                            />
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
        }</>
    )
}

export default ProductListPage;