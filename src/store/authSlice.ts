import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

interface AuthState {
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('oauth_token'),
    user: JSON.parse(localStorage.getItem('oauth_user') || 'null')
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('oauth_token', action.payload.token);
            localStorage.setItem('oauth_user', JSON.stringify(action.payload.user));
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('oauth_token');
            localStorage.removeItem('oauth_user');
        }
    }
});

export const { setAuthData, clearAuth } = authSlice.actions;
export default authSlice.reducer;