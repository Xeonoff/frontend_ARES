import { FC } from 'react';
import { Card } from 'react-bootstrap';
import { useSsid } from '../../hooks/useSsid';
import axios from 'axios';

import './ProductCardWithCount.css';


export interface ProductCardData {
    id: number,
    full_name: string,
    img: string,
    is_contact: boolean,
    buttonStatus: boolean,
    getData: Function
}

const ProductCardWithCount: FC<ProductCardData> = ({ id, full_name, img, is_contact, buttonStatus, getData}) => {
    const { session_id } = useSsid()
    const handleButtonClick = () => {
        const newStatus = !is_contact;
        changeStatus(newStatus); // Передаем новое значение
      };
    const changeStatus = async (new_status: boolean) => {
        try {
            await axios(`/api/links/`, {
                method: "PUT",
                headers: {
                    'authorization': session_id
                },
                data: {
                    'is_contact': new_status,
                    'Receiver': id
                }
            })
            getData()
        } catch (error) {
            console.log("Что-то пошло не так")
        }
    }

    return (
        <Card className="card">
            <div className="cardImageWrap"><a href={"/products/" + id.toString()}><Card.Img className="cardImage" src={img} height={100} width={100} /></a></div>
            <div className="cardTitleWrap"><a href={"/products/" + id.toString()}><Card.Title className="cardTitle">{full_name}</Card.Title></a></div>
            {buttonStatus === true &&
            <div style={{ position: "relative", top: "-20px" }}>
                <button className='cardStatusGreen' style = {{marginTop: '25px', marginRight: '200px'}} onClick= {handleButtonClick}>Изменить в контактах</button>
            </div>
            }
            <div>
                <span>
                    {is_contact? "Есть в контактах": "Нет в списке контактов"}
                </span>
            </div>
        </Card>
    )
}

export default ProductCardWithCount