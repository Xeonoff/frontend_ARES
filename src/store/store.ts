import buttonReducer from "./buttonSlice"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from 'redux-persist'
import authReducer from "./authSlice"
import orderFilterReducer from "./orderFilterSlice"
import productFilterReducer from "./productFilterSlice"
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import detailedViewReducer from './detailedViewSlice'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: authReducer,
    productFilter: productFilterReducer,
    orderFilter: orderFilterReducer,
    button: buttonReducer,
    detailedView: detailedViewReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>