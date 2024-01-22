import { FC, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import { useSsid } from '../../hooks/useSsid';
import ProductCardWithCount, { ProductCardData } from "../../components/ProductCardWithCount/ProductCardWithCount";
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Loader from '../../components/Loader/Loader.tsx';
import { useDispatch } from 'react-redux';
import { cleanButton } from "../../store/buttonSlice.ts";
import axios from 'axios';

import "./OrderPage.css"


interface Position {
    is_contact: boolean,
    Receiver: number,
    receiver_data: ProductCardData
}

interface Response {
    id: number,
    created: string,
    sent: string | undefined,
    received: string | undefined,
    status: "I" | "P" | "D" | "A" | "W",
    status_send: "Q" | "A" | "D" | "R",
    username: string,
    modername: string
    positions: Position[]
}

const OrderPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { session_id } = useSsid()
    const [ data, setData ] = useState<Response> ()
    const resetButton = () => {
        dispatch(cleanButton())
    }
    const getData = async () => {
        try {
            const response = await axios(`/api/sending/${id}/`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'authorization': session_id
                },
            })
            setData(response.data)
            console.log(data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
            navigate('/products')
            resetButton()
        }
        
    }

    useEffect(() => {
        getData().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, [])

    const sendCart = async () => {
        try {
            await axios(`http://localhost:8000/sending/`, {
                method: "PUT",
                headers: {
                    'authorization': session_id
                }
            })
            resetButton()
            navigate('/orders')
        } catch (error) {
            console.log(error)
        }
    }

    const deleteCart = async () => {
        try {
            await axios(`http://localhost:8000/sending/`, {
                method: "DELETE",
                headers: {
                    'authorization': session_id
                }
            })
            resetButton()
            navigate('/products')
        } catch (error) {
            console.log(error)
        }
    }

    const deleteFromCart = async (receiver_id: number) => {
        try {
            const response = await axios(`http://localhost:8000/links/`, {
                method: "DELETE",
                data: {
                    'Receiver': receiver_id
                },
                headers: {
                    'authorization': session_id
                }
            })
            getData()
            if (response.data == "undefined") {
                navigate('/products')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getTextStatus = (status: string) => {
        if (status === 'P') {
            return 'отправлен'
        } else if (status === 'A') {
            return 'принят'
        } else if (status == 'W') {
            return 'отклонён'
        }
        return ''
    }

    const getStatusColor = (status: string) => {
        if (status == 'принят') {
            return "rgb(73, 171, 50)"
        } else if (status == 'отклонён') {
            return "rgb(237, 104, 137)"
        } else if (status == 'отправлен') {
            return "rgb(193, 189, 58)"
        } else {
            return "white"
        }
    }

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row>
                {data && data.status == 'I' ? <Breadcrumbs pages={[ { link: `/orders`, title: `мои отправки` }, { link: `/orders/${id}`, title: `текущая отправка` } ]} /> :
                data && <Breadcrumbs pages={[ { link: `/orders`, title: `мои отправки` }, { link: `/orders/${id}`, title: `Отправка №${data.id} от ${data.sent?.slice(0, 10)}` } ]} /> }
            </Row>
            <Container id="cart-page" style={{ marginLeft: "30px" }}>
                <Row style={{ display: "flex" }}>
                    <Col style={{ width: "60%" }}>
                        {data && data.status == 'I' && <h1 className="cart-main-text">Вы добавили:</h1>}
                        {data && data.status != 'I' && <h1 className="cart-main-text" style={{ color: `${getStatusColor(getTextStatus(data.status))}` }}>{`Отправка №${data.id} от ${data.sent?.slice(0, 10)}: ${getTextStatus(data.status)}`}</h1>}
                    </Col>
                    {data && data.status == 'I' && <Col style={{ display: "flex", marginTop: "22px" }}>
                        <button className="send-button" onClick={sendCart}>Отправить</button>
                        <button className="delete-button" onClick={deleteCart}>Отменить</button>
                    </Col>}
                </Row>
                <Row style={{ display: "flex", flexWrap: "wrap", height: "max-content", position: "relative", top: "-10px" }}>
                    {data && data.status == 'I' ? data.positions.map((pos: Position)  => {
                        const product = pos.receiver_data
                        console.log(data.positions[0].is_contact)
                        console.log(pos.is_contact)
                        console.log(pos.Receiver)
                        console.log(pos.receiver_data)
                        return (
                            <div>
                                <button className="remove-button" onClick={() => {deleteFromCart(product.id)}}>✖️</button>
                                <ProductCardWithCount key={product.id} id={product.id} full_name={product.full_name} img={product.img} is_contact={pos.is_contact} buttonStatus = {true} getData={getData}/>
                            </div>
                        )}
                    ) : data && data.positions.map((pos: Position)  => {
                        const product = pos.receiver_data
                        console.log(pos.is_contact)
                        return (
                            <ProductCardWithCount key={product.id} id={product.id} full_name={product.full_name} img={product.img} is_contact={pos.is_contact} buttonStatus = {false} getData={getData}/>
                        )}
                    )}
                </Row>
            </Container>
        </Container>
        }</>
    )
}

export default OrderPage