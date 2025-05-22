import { FC } from 'react'
import { useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HeadTitle from '../HeadTitle/HeadTitle.tsx';
import { Container, Row, Col} from 'react-bootstrap'
import "./Navbar.css"
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../store/store.ts' // Убедитесь, что путь правильный
import { toggleDetailed } from '../../store/detailedViewSlice'

const Navbar: FC = () => {
    const { isAuthenticated, isModerator, user, initiateOAuth, logout } = useAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isDetailed = useSelector((state: RootState) => state.detailedView.isDetailed)

    const handleToggleDetailed = () => {
        dispatch(toggleDetailed())
    }
    //@ts-ignore
    const CurrentID = useSelector((state) => state.button.current_id);
    const handleLogout = async () => {
        await logout()
        navigate("/products")
    }

    const getGuestNavbar = () => (
        <Row id="navbar-row" style={{ display: "flex", marginTop: "40px"}}>
            <Col style={{display: "flex", width: "70%", marginLeft: "30px", fontSize:"28px", gap:"20px" }}>
                <a className="navbar-switch" onClick={handleToggleDetailed}>
                    {isDetailed ? 'Подробно ON🟩' : 'Подробно OFF⬛️'}
                </a>
                <Link className="navbar-button" to="/">Правила📑</Link>
            </Col>
            <Col style={{ flex: 1, marginLeft: "30px", display: "flex",flexDirection: "column", alignItems: "flex-start", textAlign: "center", marginRight: "2px", marginBottom: "2px"}}>
                <a className="navbar-button" onClick={initiateOAuth} style={{ width: "90%", marginBottom: "3px"}}>Вход</a>
            </Col>
        </Row>
    )

    const getUserNavbar = () => (
        <Row id="navbar-row" style={{ display: "flex", marginTop: "47px" }}>
            <Col style={{ display: "flex", width: "70%", marginLeft: "30px", fontSize:"28px", marginTop: "-8px", gap:"20px"}}>
                <a className="navbar-switch" onClick={handleToggleDetailed}>
                    {isDetailed ? 'Подробно ON🟩' : 'Подробно OFF⬛️'}
                </a>
                <Link className="navbar-button" to="/">Правила📑</Link>
                <Link className="navbar-button" to="products/create">Создать правило📝</Link>
            </Col>
            <Col style={{ width: "30%", marginLeft: "30px" }}>
                <Link className="navbar-button" to="#" onClick={ handleLogout }>{`${user?.first_name} ${user?.username}: выход`}</Link>
            </Col>
        </Row>
    )

    const getModerNavbar = () => (
        <Row id="navbar-row" style={{ display: "flex", marginTop: "47px" }}>
            <Col style={{ width: "10%", marginLeft: "30px", fontSize:"24px", marginTop: "-6px" }}>
                <Link className="navbar-button" to="/">👥</Link>
            </Col>
            <Col style={{ width: "70%", marginLeft: "30px" }}>
                <Link className="navbar-button" to="/orders">Отправки</Link>
            </Col>
            <Col style={{ width: "30%", marginLeft: "30px" }}>
                <Link className="navbar-button" to="#" onClick={ handleLogout }>{`${user?.first_name} ${user?.username}: выход`}</Link>
            </Col>
        </Row>
    )

    const getNavbar = () => {
        if (!isAuthenticated) {
            return getGuestNavbar()
        } else if (!isModerator) {
            return getUserNavbar()
        } else {
            return getModerNavbar()
        }
    }

    return (
        <Row id="header"  style={{ 
            position: 'sticky', 
            top: 0,
            zIndex: 1000,
            background: 'white',
            width: '100%'
          }}>
            <HeadTitle />
            <Container id="nav" style={{ paddingLeft: "30px", width: "200%"}}>
                {getNavbar()}
            </Container>
        </Row>
    )
}

export default Navbar
// import { FC, useEffect, useState} from 'react'


// import { useSsid } from "../../hooks/useSsid.ts";
// import { useAuth } from '../../hooks/useAuth';
// import CartButton from '../../components/CartButton/CartButton.tsx';
// import { EmptyLoader } from '../../components/Loader/Loader.tsx';
// import HeadTitle from '../HeadTitle/HeadTitle.tsx';
// import axios from "axios";
// import { Container, Row, Col } from 'react-bootstrap'
// import "./Navbar.css"
// import { useSelector } from 'react-redux';

// interface Response {
//     SendingId: number
// }

// const Navbar: FC = () => {
//     const [ loading, setLoading ] = useState<boolean> (true)
//     const { is_authenticated, username, auth } = useAuth()
//     const { session_id } = useSsid()
//     const [ setResponse ] = useState<Response> ({
//         SendingId: -1
//     })
//     //@ts-ignore
//     const CurrentID = useSelector((state) => state.button.current_id);
//     const getFilteredProducts = async () => {
//         try {
//             const { data } = await axios(`http://127.0.0.1:8000/receivers/`, {
//                 method: "GET",
//                 headers: {
//                     'authorization': session_id
//                 },
//                 signal: AbortSignal.timeout(1000)
//             })
//             setResponse(data)
//         } catch (error) {
//             console.log("Возникла ошибка!")
//         }
//     }

//     const getData = async () => {
//         await auth()
//     }

//     useEffect(() => {
//         getFilteredProducts().then(() => {
//             setLoading(false)
//         }).catch((error) => {
//             console.log(error)
//             setLoading(false)
//         })
//     }, [])

//     useEffect(() => {
//         getData().then(() => {
//             setLoading(false)
//         }).catch((error) => {
//             console.log(error)
//             setLoading(false)
//         })
//     }, []);


//     return (
//         <> {loading ? <EmptyLoader /> :
//         <Row id="header">
//             <HeadTitle />
//             <Container id="nav" style={{ paddingLeft: "30px", width: "200%" }}>
//                 <Row id="navbar-row" style={{ display: "flex", marginTop: "47px" }}>
//                     {!is_authenticated &&
//                         <Col style={{ width: "65%", marginLeft: "30px" }}>
//                             <a className="navbar-button" href="/">👥</a>
//                         </Col>
//                     }
//                     {!is_authenticated &&
//                         <Col style={{ width: "20%", marginLeft: "30px" }}>
//                             <a className="navbar-button" href="/register">Регистрация</a>
//                         </Col>
//                     }
//                     {!is_authenticated &&
//                         <Col style={{ width: "15%", marginLeft: "30px" }}>
//                             <a className="navbar-button" href="/login">Вход</a>
//                         </Col>
//                     }   

//                     {is_authenticated &&
//                         <Col style={{ width: "60%", marginLeft: "30px" }}>
//                             <a className="navbar-button" href="/">👥</a>
//                         </Col>
//                     }
//                     {is_authenticated && <CartButton CurrentID={ CurrentID } />}
//                     {is_authenticated &&
//                         <Col style={{ width: "50%", marginLeft: "30px" }}>
//                             <a className="navbar-button" href="/orders">Мои отправки</a>
//                         </Col>
//                     }
//                     {is_authenticated && 
//                         <Col style={{ width: "15%", marginRight: "30px" }}>
//                             <a className="navbar-button" href="/profile">{username}</a>
//                         </Col>
//                     }      
//                 </Row>
//             </Container>
//         </Row>
//         }</>
//     )
// }

// export default Navbar