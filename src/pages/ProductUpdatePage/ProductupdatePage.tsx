import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Product } from "../ProductListPage/ProductListPage";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSsid } from "../../hooks/useSsid";
import { useAuth } from "../../hooks/useAuth";
import { Col, Container, Row } from "react-bootstrap";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Loader from '../../components/Loader/Loader.tsx';
import "./ProductUpdatePage.css"

export interface ProductFormData {
    full_name: string,
    email: string,
    phone: string,
    sex: string,
    bdate: string,
    img: string
}

const toFormData = (receiver: Product) => {
    return {
        full_name: receiver.full_name,
        email: receiver.email,
        phone: receiver.phone,
        sex: receiver.sex,
        bdate: receiver.bdate,
        img: ""
    }
}

const emptyProduct: Product = {
    id: -1,
    full_name: "",
    img : "",
    status : "1",
    bdate : "",
    sex : 'n',
    email : "",
    available_mem : "1024",
    phone : "",
    last_modified : ""
}

const ProductUpdatePage: FC = () => {
    const { id } = useParams()
    const [ loading, setLoading ] = useState<boolean> (true)
    const navigate = useNavigate()
    const { session_id } = useSsid()
    const { is_moderator } = useAuth()
    const pageTitle = (id ? 'изменение получателя' : 'добавление получателя')
    const [ values, setValues ] = useState<ProductFormData> (toFormData(emptyProduct))
    const [ image, setImage ] = useState<File | undefined> ()
    const [ uploadedImage, setUploadedImage ] = useState<string | undefined> ()

    !is_moderator && navigate('/products')

    const getProduct = async () => {
        const response = await axios(`http://127.0.0.1:8000/receivers/${id}/`, { method: "GET" })
        setValues(toFormData(response.data))
        setUploadedImage(response.data.image)
    }

    useEffect(() => {
        id ?
        getProduct().then(() => {
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
        })
        :
        setLoading(false)
    }, [])
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setImage(file ? file : undefined)
            setUploadedImage(URL.createObjectURL(file))
            setValues((prevValues) => ({
                ...prevValues,
                ['file_extension']: file.name.split('.').pop()
            }));
        }
    };

    const sendData = async () => {
        id ?
        await axios(`http://127.0.0.1:8000/receivers/${id}/`, {
            method: 'PUT',
            data: values,
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': session_id
            }
        })
        :
        await axios(`http://127.0.0.1:8000/receivers/`, {
            method: 'POST',
            data: values,
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': session_id
            }
        })
    }

    const sendForm = async () => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                values.img = btoa(reader.result as string)
                sendData()
            }
            reader.readAsBinaryString(image)
        } else {
            sendData()
        }
        navigate('/products')
        console.log(values)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendForm();
    };

    return (
        <> {loading ? <Loader /> :
        <Container>
            <Row>
                <Breadcrumbs pages={[ { link: window.location.pathname, title: pageTitle } ]} />
            </Row>
            <h1 className="cart-main-text" style={{ marginLeft: "30px" }}>{pageTitle}</h1>
            <form onSubmit={handleSubmit}>
                <Container id="product-form">
                    <Row style={{ display: "flex" }}>
                        <Col id="product-form-main" style={{ width: "48%" }}>
                            <Row>
                                <h2>Основные данные</h2>
                            </Row>
                            <Row>
                                <div className="left-column"><label htmlFor="title">Имя</label></div>
                                <textarea
                                    id="full_name"
                                    name="full_name"
                                    value={values.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Row>
                            <Row>
                                <div className="left-column"><label htmlFor="price">Email</label></div>
                                <input
                                    type="string"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Row>
                            <Row>
                                <div className="left-column"><label htmlFor="cnt">Телефонный номер</label></div>
                                <input
                                    type="string"
                                    id="phone"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Row>
                            <Row>
                                <div className="left-column"><label htmlFor="type">Дата  рождения</label></div>
                                <input
                                    type="date"
                                    id="bdate"
                                    name="bdate"
                                    value={values.bdate}
                                    onChange={handleChange}
                                    required
                                />
                            </Row>
                            <Row>
                                <h2>{'Пол (необязательно)'}</h2>
                            </Row>
                            <Row>
                                <div className="left-column"><label htmlFor="param_sex">Пол</label></div>
                                <select
                                    id="sex"
                                    name="sex"
                                    value={values.sex}
                                    onChange={handleChange}
                                ><option value={values.sex}>{values.sex}</option>
                                <option value="m">m</option>
                                <option value="f">f</option>
                                <option value="n">n</option>
                                </select>
                            </Row>
                        </Col>
                        <Col id="product-form-image" style={{ width: "48%" }}>
                            <Row>
                                <h2>Изображение</h2>
                            </Row>
                            <Row style={{ flexDirection: "column" }}>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleFileChange}
                                    style={{ gap: "10px" }}
                                />
                                <div style={{ width: "80%" }}>
                                    <img src={uploadedImage} alt="" style={{ width: "100%", border: "1px solid grey", borderRadius: "10px", marginTop: "30px" }} />
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <button id="product-form-submit-button" type="submit">Сохранить</button>
                    </Row>
                </Container>  
            </form>
        </Container>
        }</>
    )
}

export default ProductUpdatePage