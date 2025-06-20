// OAuthCallback.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {handleOAuthCallback } = useAuth();
    useEffect(() => {
        const parseOAuthResponse = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const error = params.get('error');

            console.log('OAuth callback params:', { code, error });

            if (code) {
                try {
                    await handleOAuthCallback(code);
                    navigate('/');
                } catch (err) {
                    console.error('OAuth processing failed:', err);
                    navigate('/', { state: { error: 'Авторизация не удалась' } });
                }
            } else if (error) {
                console.error('OAuth error:', error);
                navigate('/', { state: { error: `Ошибка авторизации: ${error}` } });
            } else {
                console.warn('Unexpected callback without code or error');
                navigate('/');
            }
        };

        parseOAuthResponse();
    }, [location, handleOAuthCallback, navigate]);

    return <div>Проверка авторизации...</div>;
};

export default OAuthCallback;