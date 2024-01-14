import { FC } from 'react'
import './Breadcrumbs.css';
import { Container, Row } from 'react-bootstrap';

interface BreadcrumbsProps {
    link: string,
    title: string
}

const Breadcrumbs: FC<{ pages: BreadcrumbsProps[] }> = ({ pages }) =>  (
    <Container id="breadcrumbs">
        <Row >
            <a className='message' href={`/`} style={{ textDecoration: "None" }}>💬</a>
            {pages && pages.map((page) => (
                <a id='textbreadcrumbs' href={ page.link } style={{ textDecoration: "None", color: "68, 183, 42" }}>{ " ➤ " + page.title }</a>
            ))}
        </Row>
    </Container>
)

export default Breadcrumbs