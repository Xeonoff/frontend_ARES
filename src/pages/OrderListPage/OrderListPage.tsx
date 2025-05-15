import { FC, useEffect, useState } from "react"
import { Col, Container, Row } from 'react-bootstrap'
import { useQuery } from "react-query";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSsid } from '../../hooks/useSsid';
import OrderTable from '../../components/OrderTable/OrderTable';
import Loader from '../../components/Loader/Loader.tsx';

import axios from 'axios';
import { useDispatch, useStore } from "react-redux";
import OrderFilter from "../../components/OrderFilter/OrderFilter.tsx";
import { updateA, updateEndDate, updateP, updateStartDate, updateUsername, updateW } from "../../store/orderFilterSlice.ts";
import parseISO from 'date-fns/parseISO'


interface Response {
    id: number,
    created: string,
    sent: string | undefined,
    received: string | undefined,
    status: "I" | "P" | "D" | "A" | "W",
    status_send: "Q" | "A" | "D" | "R",
    username: string,
    modername: string
}

const OrderListPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const { session_id } = useSsid()
    const { is_authenticated, is_moderator } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [ response, setResponse ] = useState<Response[]> ()

    //@ts-ignore
    const [ P, setP ] = useState<boolean> (useStore().getState().orderFilter.P)
    //@ts-ignore
    const [ A, setA ] = useState<boolean> (useStore().getState().orderFilter.A)
    //@ts-ignore
    const [ W, setW ] = useState<boolean> (useStore().getState().orderFilter.W)
    //@ts-ignore
    const store_startDate = useStore().getState().orderFilter.startDate
    const [ startDate, setStartDate ] = useState<Date | undefined> (store_startDate ? parseISO(store_startDate) : undefined)
    //@ts-ignore
    const store_endDate = useStore().getState().orderFilter.endDate
    const [ endDate, setEndDate ] = useState<Date | undefined> (store_endDate ? parseISO(store_endDate) : undefined)
    //@ts-ignore
    const [ username, setUsername ] = useState<string> (useStore().getState().orderFilter.username)

    const getFilterStatusParams = () => {
        let result = ''
        if (P) {
            result += 'P'
        }
        if (A) {
            result += 'A'
        }
        if (W) {
            result += 'W'
        }
        return result
    }

    const filterByUsername = (orders: Response[], username: string) => {
        console.log('фильтрую по', username)
        if (username == "") {
            return orders
        }
        return orders.filter((request) => {
            return request.username.toLowerCase().includes(username.toLowerCase())
        })
    }

    const getOrders = async () => {
        try {
            console.log(`start_date = ${startDate}`)
            console.log(`end_date = ${endDate}`)
            const { data } = await axios(`/api/sending/`, {
                method: "GET",
                headers: {
                    'authorization': session_id
                },
                params: {
                    'status': getFilterStatusParams(),
                    'start_date': startDate,
                    'end_date': endDate,
                }
            })
            dispatch(updateP(P))
            dispatch(updateA(A))
            dispatch(updateW(W))
            dispatch(updateStartDate(startDate))
            dispatch(updateEndDate(endDate))
            dispatch(updateUsername(username))
            setResponse(filterByUsername(data, username))
        } catch {
            console.log("Что-то пошло не так")
        }
    }

    useQuery('orders', getOrders, { refetchInterval: 2000 });

    const processStatusUpdate = async (id: number, new_status: 'A' | 'W') => {
        try {
            await axios(`/api/sending/${id}/`, {
                method: "PUT",
                headers: {
                    'authorization': session_id
                },
                data: {
                    'status': new_status
                }
            })
        } catch {
            console.log("Что-то пошло не так")
        }
    }

    useEffect(() => {
        getOrders().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, [])

    !is_authenticated && !loading && navigate('/')

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

    const getTextSendStatus = (status: string) => {
        if (status === 'Q') {
            return 'в очереди'
        } else if (status === 'A') {
            return 'принято к отправке'
        } else if (status == 'D') {
            return 'доставлено'
        } else if (status == 'R') {
            return 'прочитано'
        }
        return 'ожидайте...'
    }

    const getTransformedData = () => {
        let result: any = []
        response?.map((request) => {
            if (request.status != 'I') {
                if(request.received == undefined){
                    result.push({
                        pk: request.id,
                        send: `${request.sent?.slice(0, 10)} ${request.sent?.slice(11, 19)}`,
                        closed: `-`,
                        created: `${request.created?.slice(0, 10)}, ${request.created?.slice(11, 19)}`,
                        status: getTextStatus(request.status),
                        username: request.username,
                        eventstatus: getTextSendStatus(request.status_send)
                    })
                }
                else{
                    result.push({
                    pk: request.id,
                    send: `${request.sent?.slice(0, 10)}, ${request.sent?.slice(11, 19)}`,
                    closed: `${request.received?.slice(0, 10)}, ${request.received?.slice(11, 19)}`,
                    created: `${request.created?.slice(0, 10)}, ${request.created?.slice(11, 19)}`,
                    status: getTextStatus(request.status),
                    username: request.username,
                    eventstatus: getTextSendStatus(request.status_send)
                    })
                }
            }
        })
        return result
    }

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row style={{ display: "flex" }}>
                <Col style={{ width: "35%" }}>
                    <h1 className="cart-main-text" style={{ marginTop: "30px", marginLeft: "30px" }}>{is_moderator ? 'Отправки пользователей' : 'Список ваших отправок'}: </h1>
                </Col>
                <Col style={{ width: "25%" }}></Col>
                <Col style={{ width: "40%" }}>
                    <OrderFilter
                        P={P}
                        setP={setP}
                        A={A}
                        setA={setA}
                        W={W}
                        setW={setW}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        username={username}
                        setUsername={setUsername}
                        is_moderator={is_moderator}
                    />
                </Col>
            </Row>
            <Row>
                {response?.length ?
                <OrderTable requests={getTransformedData()} is_moderator={is_moderator} processStatusUpdate={processStatusUpdate} /> :
                <h1 style = {{marginLeft: "30px"}} className="cart-help-text">Пусто</h1>}
            </Row>
        </Container>
        }</>
    )
}

export default OrderListPage