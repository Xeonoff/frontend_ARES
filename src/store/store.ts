import buttonReducer from "./buttonSlice"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from 'redux-persist'
import authReducer from "./authSlice"
import productFilterReducer from "./productFilterSlice"
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: authReducer,
    productFilter: productFilterReducer,
    button: buttonReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store)