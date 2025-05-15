import { FC } from 'react';
import { Card } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './ProductCard.css';


export interface ReceiverCardData{
    id: number,
    phone: string,
    full_name: string,
    img: string,
}

interface RuleCardData {
    name: string;
    content: string;
    faculty?: string;
    semester?: number;
    building?: string;
    department?: string;
    parsed_content?: any;
}

const ProductCard: FC<RuleCardData> = ({ name, content, faculty, semester, building, department, parsed_content }) => (
    <Link className="ruleCard" to={"/products/" + name}><Card className="card">
        <div className="cardTitleWrap"><pre className="cardTitle"><Card.Text style={{color:"rgba(0,0,0)"}}>{content}</Card.Text></pre></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{faculty}</Card.Title></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{semester}</Card.Title></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{building}</Card.Title></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{department}</Card.Title></div>
        <div className="cardTitleWrap"><Card.Title className="cardTitle" style={{color:"rgba(0,0,0)"}}>{parsed_content}</Card.Title></div>
    </Card></Link>
)

export default ProductCard