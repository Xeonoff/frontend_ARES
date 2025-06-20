// useAuth.tsx
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../store/store";
import { setAuthData, clearAuth } from "../store/authSlice";

const OAUTH_REDIRECT_URI = `${window.location.origin}/oauth-callback`;
const OAUTH_AUTHORIZE_URL = `https://science.iu5.bmstu.ru/sso/authorize?response_type=code&redirect_uri=${OAUTH_REDIRECT_URI}`;

export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state: RootState) => state.user);
    const isAuthenticated = !!token;
    const isModerator = user?.is_staff || false;

    const initiateOAuth = () => {
        const authUrl = new URL(OAUTH_AUTHORIZE_URL);
        authUrl.searchParams.append('response_type', 'code');
        window.location.href = authUrl.toString();
    };

    const handleOAuthCallback = async (code: string) => {
        try {
            const response = await axios.post('/api/auth/oauth/', {
                code,
                redirect_uri: OAUTH_REDIRECT_URI
            });

            const { access_token, user } = response.data;
            dispatch(setAuthData({ token: access_token, user }));
            navigate('/');
        } catch (error) {
            console.error('OAuth error:', error);
            dispatch(clearAuth());
        }
    };

    const logout = () => {
        dispatch(clearAuth());
        navigate('/login');
    };

    const checkAuth = async () => {
        if (token) {
            try {
                await axios.get('/api/auth/profile/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                dispatch(clearAuth());
            }
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        isModerator,
        initiateOAuth,
        handleOAuthCallback,
        logout,
        checkAuth
    };
}