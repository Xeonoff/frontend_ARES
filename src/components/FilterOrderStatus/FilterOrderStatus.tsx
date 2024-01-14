import { FC, useEffect, useState, ChangeEvent } from 'react';
import { Container, Row } from 'react-bootstrap';


type Filter = {
    P: boolean;
    A: boolean;
    W: boolean;
}
  
type FilterByStatusProps = {
    state: Filter,
    handleFilterChange: (filter: Filter) => void;
}

const FilterOrderStatus: FC<FilterByStatusProps> = ({ state, handleFilterChange }) => {
    const [filter, setFilter] = useState<Filter>(state);
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFilter((prevState) => ({
        ...prevState,
        [name as keyof Filter]: checked,
        }));
    };
    
    useEffect(() => {
        handleFilterChange(filter);
    }, [filter, handleFilterChange]);

    return (
        <Container>
            <Row>
                <h3 style={{ color: "rgb(19, 113, 35)", fontSize: "24px", fontWeight: "500" }}>
                    Какие заявки показывать?
                </h3>
                <Container style={{ display: "flex", gap: "20px", position: "relative", top: "-10px" }}>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="P"
                            defaultChecked={state.P}
                            onChange={handleChange}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(193, 189, 58)", fontSize: "20px", letterSpacing: "1px" }}>отправлен</h3>
                    </label>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="A"
                            defaultChecked={state.A}
                            onChange={handleChange}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(73, 171, 50)", fontSize: "20px", letterSpacing: "1px" }}>принят</h3>
                    </label>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="W"
                            defaultChecked={state.W}
                            onChange={handleChange}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(237, 104, 137)", fontSize: "20px", letterSpacing: "1px" }}>отклонен</h3>
                    </label>
                </Container>
            </Row>
        </Container>
    )
}

export default FilterOrderStatus;