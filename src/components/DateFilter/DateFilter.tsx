import { FC, Dispatch } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Container } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru"; // the locale you want
import "./DateFilter.css"
registerLocale("ru", ru);



interface Props {
    startDate: Date | undefined,
    setStartDate: Dispatch<Date>,
    endDate: Date | undefined,
    setEndDate: Dispatch<Date>,
    send: () => any,
}

const DateFilter: FC<Props> = ({ startDate, setStartDate, endDate, setEndDate, send }) => {
    const getDefaultStartDate = (date: Date) => {
        const endDate = new Date(date);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        return endDate;
    }
    
    const getDefaultEndDate = (date: Date) => {
        const endDate = new Date(date);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        return endDate;
    }

    return (
        <Container id="filter-date">
            <DatePicker 
                locale = "ru"
                selected={startDate}
                onChange={(date: Date) => setStartDate(getDefaultStartDate(date))}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Дата начала"
            />
            <DatePicker
                locale = "ru"
                selected={endDate}
                onChange={(date: Date) => setEndDate(getDefaultEndDate(date))}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Дата конца"
            />
            <button onClick={send}>применить</button>
        </Container>
    )
  }
  
  export default DateFilter;
