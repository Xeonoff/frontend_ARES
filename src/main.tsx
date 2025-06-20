import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { FC } from "react";
import ProductListPage from "./pages/ProductListPage/ProductListPage.tsx";
import ProductUpdatePage from "./pages/ProductUpdatePage/ProductupdatePage.tsx";
import OAuthCallback from "./pages/OAuthCallback/OAuthCallback.tsx";

import Navbar from "./components/Navbar/Navbar.tsx";
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from "./store/store.ts";

import { Container, Row } from "react-bootstrap";
import "./main.css";

//import { useAuth } from "./hooks/useAuth.ts";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

const App: FC = () => {

    return (
        <Container>
            <Navbar/>
            <Row>
                <Routes>
                    <Route path="/"             element={ <Navigate to='/products' replace /> } />
                    <Route path="products/"     element={ <ProductListPage /> } />
                    <Route path="products/:name" element={<ProductUpdatePage />} />
                    <Route path="products/create" element={<ProductUpdatePage />} />
                    <Route path="oauth-callback/" element={<OAuthCallback />} />
                    <Route path="oauth-callback/" element={<OAuthCallback />} />
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