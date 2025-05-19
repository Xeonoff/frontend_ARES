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

const ProductCard: FC<RuleCardData> = ({ name, content, faculty, semester, building, department }) => (
    <Link className="ruleCard" to={"/products/" + name}>
      <Card className="card">
        <Card.Body className="card-body">
          <div>
            {name}
          </div>
          <div className="content-block">
            <Card.Text className="card-content">{content}</Card.Text>
          </div>
          <div className="meta-info">
            {faculty && <div className="meta-item">{faculty}</div>}
            {semester && <div className="meta-item"><span className="meta-item-span">Семестр:</span> {semester}</div>}
            {building && <div className="meta-item"><span className="meta-item-span">Корпус:</span> {building}</div>}
            {department && <div className="meta-item"><span className="meta-item-span">Кафедра:</span> {department}</div>}
          </div>
        </Card.Body>
      </Card>
    </Link>
  )

export default ProductCard