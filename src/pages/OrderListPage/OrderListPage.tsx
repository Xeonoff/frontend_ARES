import { FC, useEffect, useState } from "react"
import { Col, Container, Row } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth';
import { useSsid } from '../../hooks/useSsid';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import OrderTable from '../../components/OrderTable/OrderTable';
import FilterOrderStatus from '../../components/FilterOrderStatus/FilterOrderStatus';
import Loader from '../../components/Loader/Loader.tsx';

import axios from 'axios';
import DateFilter from "../../components/DateFilter/DateFilter.tsx";


type Filter = {
    P: boolean;
    A: boolean;
    W: boolean;
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
}

const OrderListPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const { session_id } = useSsid()
    const { is_authenticated } = useAuth()
    const [ response, setResponse ] = useState<Response[]> ()

    const [filter, setFilter] = useState<Filter> ({
        P: true,
        A: true,
        W: true,
    });

    const [ startDate, setStartDate ] = useState<Date | undefined> ()
    const [ endDate, setEndDate ] = useState<Date | undefined> ()
    
    const handleFilterChange = (newFilter: Filter) => {
        setFilter(newFilter);
    };

    const getFilterStatusParams = () => {
        let result = ''
        if (filter.P) {
            result += 'P'
        }
        if (filter.A) {
            result += 'A'
        }
        if (filter.W) {
            result += 'W'
        }
        return result
    }

    const getOrders = async () => {
        try {
            console.log(`start_date = ${startDate}`)
            console.log(`end_date = ${endDate}`)
            const { data } = await axios(`http://127.0.0.1:8000/sending/`, {
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
            setResponse(data)
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
    }, [filter])

    if (!is_authenticated && !loading) {
        return (
            <Container style={{ marginLeft: "30px" }}>
                <h1 className="cart-help-text">Войдите в аккаунт, чтобы посмотреть список ваших отправок</h1>
            </Container>
        )
    }

    if (response && !loading && response.length == 0) {
        return (
            <Container style={{ marginLeft: "30px" }}>
                <h1 className="cart-help-text">Вы еще ничего не отправляли</h1>
            </Container>
        )
    }

    const getTextStatus = (status: string) => {
        if (status === 'P') {
            return 'отправлен'
        } else if (status === 'A') {
            return 'принят'
        } else if (status == 'D') {
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
        return ''
    }

    const getTransformedData = () => {
        let result: any = []
        response?.map((request) => {
            if (request.status != 'I') {
                result.push({
                    pk: request.id,
                    send: `${request.sent?.slice(0, 10)} ${request.sent?.slice(11, 19)}`,
                    status: getTextStatus(request.status),
                    eventstatus: getTextSendStatus(request.status_send)
                })
            }
        })
        return result
    }

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row>
                <Breadcrumbs pages={[ { link: `/orders`, title: `мои отправки` } ]} />
            </Row>
            <Row style={{ display: "flex" }}>
                <Col style={{ width: "35%" }}>
                    <h1 className="cart-main-text" style={{ marginTop: "30px", marginLeft: "30px" }}>Список ваших отправок: </h1>
                </Col>
                <Col style={{ width: "25%" }}></Col>
                <Col style={{ width: "40%" }}>
                    <FilterOrderStatus state={filter} handleFilterChange={handleFilterChange} />
                </Col>
            </Row>
            <Row>
                <DateFilter
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    send={getOrders}
                />
            </Row>
            <Row>
                <OrderTable requests={getTransformedData()}/>
            </Row>
        </Container>
        }</>
    )
}

export default OrderListPage