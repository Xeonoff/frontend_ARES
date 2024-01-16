import { FC, useEffect, useState } from "react";
import { useSsid } from "../../hooks/useSsid";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { getDefaultResponse } from "../../assets/MockObjects";
import { useDispatch, useStore } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import Loader from "../../components/Loader/Loader";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ProductTable from "../../components/ProductTable/ProductTable";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/Filter/Filter";

interface Product {
    id: number,
    full_name : string,
    img : string,
    status : '1' | '0',
    bdate : string,
    sex : 'm' | 'f' | 'n',
    email : string,
    available_mem : string,
    phone : string,
    last_modified : string
}

interface Response {
    SendingId: number
    Receivers: Product[]
}

const ProductTablePage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)
    const { session_id } = useSsid()
    const { is_moderator } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [ response, setResponse ] = useState<Response> ()

    //@ts-ignore
    const [ searchValue, setSearchValue ] = useState<string> (useStore().getState().productFilter.searchValue)

    !is_moderator && navigate('/')

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
        } catch (error) {
            setResponse(getDefaultResponse(3, searchValue))
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            await axios(`http://localhost:8000/receivers/${id}/`, {
                method: "DELETE",
                headers: {
                    'authorization': session_id
                }
            })
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFilteredProducts().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, [dispatch])

    const getTransformedData = () => {
        let result: any = []
        response?.Receivers.map((receiver) => {
            result.push({
                id: receiver.id,
                full_name: receiver.full_name,
                status: receiver.status,
                img: receiver.img
            })
        })
        return result
    }

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row>
                <Breadcrumbs pages={[]} />
            </Row>
            <Row style={{ display: "flex" }}>
                <Col style={{ width: "22%", marginLeft: "30px", marginTop: "30px", display: "flex", flexDirection: "column" }}>
                    <Filter
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        send={getFilteredProducts}
                    />
                    <button className="create-product-button" onClick={() => navigate(`/products/create`)}>Новый получатель</button>
                </Col>
                <ProductTable
                    receivers={getTransformedData()}
                    deleteProduct={deleteProduct}
                />
            </Row>
        </Container>
        }</>
    )
}

export default ProductTablePage;