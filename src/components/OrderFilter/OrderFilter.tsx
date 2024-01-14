import { FC, ChangeEvent, Dispatch } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru"; // the locale you want
import 'react-datepicker/dist/react-datepicker.css';
import { getBeginOfDay, getEndOfDay } from '../../store/orderFilterSlice';
import "./OrderFilter.css"
registerLocale("ru", ru);

interface Props {
    P: boolean,
    setP: Dispatch<boolean>,
    A: boolean,
    setA: Dispatch<boolean>,
    W: boolean,
    setW: Dispatch<boolean>,
    startDate: Date | undefined,
    setStartDate: Dispatch<Date | undefined>,
    endDate: Date | undefined,
    setEndDate: Dispatch<Date | undefined>,
    username: string,
    setUsername: Dispatch<string>,
    is_moderator: boolean
}

const OrderFilter: FC<Props> = ({ P, setP, A, setA, W, setW, startDate, setStartDate, endDate, setEndDate, username, setUsername, is_moderator }) => {
    const handleChangeP = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        setP(checked)
    }

    const handleChangeA = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        setA(checked)
    }

    const handleChangeW = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        setW(checked)
    }

    const handleChangeStartDate = (date: Date) => {
        setStartDate(getBeginOfDay(date))
    }

    const handleChangeEndDate = (date: Date) => {
        setEndDate(getEndOfDay(date))
    }

    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    return (
        <Container>
            <Row>
                <h3 style={{ color: "rgb(19, 113, 35)", fontSize: "24px", fontWeight: "500" }}>
                    Какие заявка показывать?
                </h3>
                <Container style={{ display: "flex", gap: "20px", position: "relative", top: "-30px" }}>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="P"
                            defaultChecked={P}
                            onChange={handleChangeP}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(193, 189, 58)", fontSize: "20px", letterSpacing: "1px" }}>отправлен</h3>
                    </label>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="A"
                            defaultChecked={A}
                            onChange={handleChangeA}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(73, 171, 50)", fontSize: "20px", letterSpacing: "1px" }}>принят</h3>
                    </label>
                    <label style={{ display: "flex", gap: "5px" }}>
                        <input
                            type="checkbox"
                            name="W"
                            defaultChecked={W}
                            onChange={handleChangeW}
                            style={{ width: "20px", height: "20px", position: "relative", top: "18px" }}
                        />
                        <h3 style={{ color: "rgb(237, 104, 137)", fontSize: "20px", letterSpacing: "1px" }}>отклонен</h3>
                    </label>
                </Container>
            </Row>
            <Row style={{display: "flex", position: "relative", top: "-30px" }}>
                <Col><DatePicker className="date-picker"
                    locale = "ru"
                    selected={startDate}
                    onChange={(date: Date) => handleChangeStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Дата начала"
                /></Col>
                <Col><DatePicker className="date-picker"
                    locale = "ru"
                    selected={endDate}
                    onChange={(date: Date) => handleChangeEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Дата конца"
                /></Col>
            </Row>
            {is_moderator && <Row style={{ position: "relative", top: "-10px", width: "70%" }}>
                <input className="date-picker"
                    type="text"
                    autoComplete="off"
                    size={40}
                    placeholder="Имя пользователя"
                    name="title"
                    value={username}
                    onChange={handleChangeUsername}
                    style={{ width: "100%" }}
                />
            </Row>}
        </Container>
    )
}

export default OrderFilter;