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
import { useSearchParams, useNavigate } from 'react-router-dom';

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
    count: number;
    next: string | null;
    previous: string | null;
    results: Rule[];
}

const ProductListPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = () => {
        const pageParam = searchParams.get('page');
        return pageParam && !isNaN(parseInt(pageParam)) && parseInt(pageParam) > 0 
            ? parseInt(pageParam) 
            : 1;
    };

    const [ loading, setLoading ] = useState<boolean> (true)
    const [currentPage, setCurrentPage] = useState<number>(initialPage());
    const [totalPages, setTotalPages] = useState<number>(1);
    const [ response, setResponse ] = useState<Response> ({
        count: 0,
        next: null,
        previous: null,
        results: [],
    })
    const [inputPage, setInputPage] = useState<string>(initialPage().toString());

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        setInputPage(newPage.toString());
        searchParams.set('page', newPage.toString());
        setSearchParams(searchParams);
    };

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Разрешаем только числа
            setInputPage(value);
        }
    };

    const handleManualPageChange = () => {
        const page = parseInt(inputPage);
        if (page >= 1 && page <= totalPages) {
            updatePage(page);
            getFilteredProducts(page);
        } else {
            setInputPage(currentPage.toString());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleManualPageChange();
        }
    };
    //@ts-ignore
    const [ searchValue, setSearchValue] = useState<string> (useStore().getState().productFilter.searchValue)

    const { session_id } = useSsid()
    const { is_authenticated, is_moderator } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    is_moderator && navigate('/')

    const getFilteredProducts = async (page: number = 1) => {
            try {
                const { data } = await axios(`/api/constraints/`, {
                    method: "GET",
                    headers: {
                        'authorization': session_id
                    },
                    params: {
                        query: searchValue,
                        page: page,
                        page_size: 10
                    },
                    signal: AbortSignal.timeout(1000)
                })
                setResponse(data)
                setTotalPages(Math.ceil(data.count / 10));
                dispatch(updateSearchValue(searchValue))
            } catch (error) {
                console.log(searchValue)
                setResponse(getDefaultResponse(10))
            }
    }

    const handleNextPage = () => {
        if (response.next) {
            const newPage = currentPage + 1;
            updatePage(newPage);
            getFilteredProducts(newPage);
        }
    };

    const handlePrevPage = () => {
        if (response.previous) {
            const newPage = currentPage - 1;
            updatePage(newPage);
            getFilteredProducts(newPage);
        }
    };

    useEffect(() => {
        getFilteredProducts(currentPage).then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }, [dispatch, currentPage, searchValue])

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row style={is_authenticated ? { display: 'flex', position: 'relative', top: '-25px' } : {display: 'flex'}}>
                <Col style={{ marginBottom: "30px", marginLeft: "10px" }}>
                    <div className="pagination-container">
                        <button 
                            onClick={handlePrevPage}
                            disabled={!response.previous}
                            className="pagination-button"
                        >
                            Назад
                        </button>
                        
                        <div className="page-controls">
                            <input
                                type="text"
                                className="page-input"
                                value={inputPage}
                                onChange={handlePageInput}
                                onKeyPress={handleKeyPress}
                            />
                            <span className="page-info">
                                из {totalPages}
                            </span>
                            <button 
                                onClick={handleManualPageChange}
                                className="pagination-button go-button"
                            >
                                Перейти
                            </button>
                        </div>

                        <button 
                            onClick={handleNextPage}
                            disabled={!response.next}
                            className="pagination-button"
                        >
                            Вперед
                        </button>
                    </div>
                    <div id="box">
                        {response.results.map((constraint: Rule, index) => (
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