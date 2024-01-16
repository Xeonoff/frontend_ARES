import { FC } from 'react';
import { Card } from 'react-bootstrap';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

import './ProductCard.css';


export interface ReceiverCardData{
    id: number,
    phone: string,
    full_name: string,
    img: string,
}

const ProductCard: FC<ReceiverCardData> = ({ id, full_name, img, phone }) => (
    <a href={"/products/" + id.toString()}><Card className="card">
        <div className="cardImageWrap"><ImageWrapper className="cardImage" src={`${img}`} based="default.jpg" /></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{full_name}</Card.Title></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{phone}</Card.Title></div>
    </Card></a>
)

export default ProductCard