import { FC, useState, useEffect } from 'react';
import { useSsid } from "../../hooks/useSsid.ts";
import { useAuth } from '../../hooks/useAuth.ts';

import axios from "axios";
import { getDefaultResponse } from '../../assets/MockObjects.ts';
import { updateSearchValue } from '../../store/productFilterSlice.ts';
import ProductCard from "../../components/ProductCard/ProductCard.tsx";
import Loader from '../../components/Loader/Loader.tsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useStore } from 'react-redux';
import "./ProductListPage.css";
import { useNavigate } from 'react-router-dom';

export interface Product {
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

export interface Rule {
    name: string;
    content: string;
    faculty?: string;
    semester?: number;
    building?: string;
    department?: string;
    parsed_content?: any;
}

interface Response {
    Constraints: Rule[]
}

const ProductListPage: FC = () => {
    const [ loading, setLoading ] = useState<boolean> (true)

    const [ response, setResponse ] = useState<Response> ({
        Constraints: [],
    })
    //@ts-ignore
    const [ searchValue, setSearchValue] = useState<string> (useStore().getState().productFilter.searchValue)

    const { session_id } = useSsid()
    const { is_authenticated, is_moderator } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    is_moderator && navigate('/')

    const getFilteredProducts = async () => {
            try {
                const { data } = await axios(`/api/receivers/`, {
                    method: "GET",
                    headers: {
                        'authorization': session_id
                    },
                    params: {
                        title: searchValue,
                        status: 1
                    },
                    signal: AbortSignal.timeout(1000)
                })
                setResponse(data)
                dispatch(updateSearchValue(searchValue))
            } catch (error) {
                console.log(searchValue)
                setResponse(getDefaultResponse(10))
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

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row style={is_authenticated ? { display: 'flex', position: 'relative', top: '-25px' } : {display: 'flex'}}>
                <Col style={{ marginBottom: "30px", marginLeft: "10px" }}>
                    <div id="box">
                        {response.Constraints.map((constraint: Rule, index) => (
                            <div key = {index}>
                                <ProductCard key={constraint.name}
                                    name = {constraint.name}
                                    content = {constraint.content}
                                    faculty = {constraint.faculty}
                                    semester = {constraint.semester}
                                    building = {constraint.building}
                                    department = {constraint.department}
                                    parsed_content = {constraint.parsed_content}
                                />
                            </div> 
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
        }</>
    )
}

export default ProductListPage;