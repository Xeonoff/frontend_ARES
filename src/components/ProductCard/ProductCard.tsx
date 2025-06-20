import { FC } from 'react';
import { Card } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useSelector} from 'react-redux';
import { RootState } from '../../store/store.ts'
import './ProductCard.css';

interface Step {
  keyword: string;
  text: string;
}

interface Scenario {
  scenario_name: string;
  steps: Step[];
}
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
    parsed_content?: Scenario[];
}

const ProductCard: FC<RuleCardData> = ({ name, content, faculty, semester, building, department, parsed_content }) =>{ 
  const isDetailed = useSelector((state: RootState) => state.detailedView.isDetailed)
  return(
    <Link className="ruleCard" to={"/products/" + name}>
      <Card className="card">
        <Card.Body className="card-body">
          <div>
            {name}
          </div>
          {isDetailed ? (
            <div className="detailed-content">
              {(parsed_content || []).map((scenario, idx) => (
              <div key={idx} className="scenario">
                <div><span className="keyword">Сценарий:</span>{scenario.scenario_name}</div>
                <ul className="steps-list">
                  {scenario.steps.map((step, stepIdx) => (
                    <li key={stepIdx}>
                      <span className="keyword">{step.keyword}:</span>
                      {step.text}
                    </li>
                  ))}
                </ul>
              </div>
              ))}
            </div>
          ) : (
          <div className="content-block">
            <Card.Text className="card-content">{content}</Card.Text>
          </div>
          )}
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
}
export default ProductCard