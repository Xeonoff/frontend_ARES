import { Dispatch, FC } from "react";

import { Container, Row } from "react-bootstrap";
import "./Filter.css";


interface FilterData {
    searchValue: string,
    setSearchValue: Dispatch<string>,
    send: () => any,
}

const Filter: FC<FilterData> = ({ searchValue, setSearchValue, send }) => {

    return (
        <Container id="filter">
            <Row><h3 className="filter-title">Фильтр</h3></Row>
            <form action="" method="get" id="filter-form">   
                <Container style={{ transform: "translateY(-40%)", paddingBottom: "20px", paddingLeft: "20px"}}>
                    <Row style={{ display: "flex"}}>
                        <input className="filter-input"
                            type="text"
                            autoComplete="off"
                            size={30}
                            placeholder="начните вводить имя"
                            name="title"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        /><input className="filter-submit" type="button" value="🔎" onClick={send}/>
                    </Row>
                </Container>
            </form>
        </Container>
    )
}

export default Filter;