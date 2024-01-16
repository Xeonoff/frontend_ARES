import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { FC } from "react";
import ProductListPage from "./pages/ProductListPage/ProductListPage.tsx";
import ProductPage from "./pages/ProductPage/ProductPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import OrderListPage from "./pages/OrderListPage/OrderListPage.tsx";
import OrderPage from "./pages/OrderPage/OrderPage.tsx";
import ProductUpdatePage from "./pages/ProductUpdatePage/ProductUpdatePage.tsx";
import ProductTablePage from "./pages/ProductTablePage/ProductTablePage.tsx";

import Navbar from "./components/Navbar/Navbar.tsx";
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from "./store/store.ts";

import { Container, Row } from "react-bootstrap";
import "./main.css";

import { useAuth } from "./hooks/useAuth.ts";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

const App: FC = () => {
    const { is_moderator } = useAuth()

    const getStartPage = () => {
        return (is_moderator ? '/product-table' : '/products')
    }
    return (
        <Container>
            <Navbar />
            <Row>
                <Routes>
                    <Route path="/"             element={ <Navigate to={getStartPage()} replace /> } />
                    <Route path="products/"     element={ <ProductListPage /> } />
                    <Route path="products/:id"  element={ <ProductPage /> } />
                    <Route path="login/"        element={ <LoginPage /> } />
                    <Route path="register/"     element={ <RegisterPage /> } />
                    <Route path="profile/"      element={ <ProfilePage /> } />
                    <Route path="orders/"       element={ <OrderListPage /> } />
                    <Route path="orders/:id"    element={ <OrderPage /> } />
                    <Route path="product-table/"        element={ <ProductTablePage /> } />
                    <Route path="products/:id/update/"  element={ <ProductUpdatePage /> } />
                    <Route path="products/create/"      element={ <ProductUpdatePage /> } />
                </Routes>
            </Row>
        </Container>
    )
}

root.render(
    <QueryClientProvider client={ queryClient }>
        <Provider store={ store }>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </QueryClientProvider>
);