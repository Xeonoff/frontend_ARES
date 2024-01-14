import { createSlice } from "@reduxjs/toolkit"


interface Filter {
    cache: [],
    searchValue: string,
}

const initialState: Filter = {
    cache: [],
    searchValue: "",
}

const productFilterSlice = createSlice({
    name: 'productFilter',
    initialState: initialState,
    reducers: {
        updateCache(state, action) {
            state.cache = action.payload
            console.log(action.payload)
        },
        updateSearchValue(state, action) {
            state.searchValue = action.payload
        },
    }
})

export const { updateCache, updateSearchValue} = productFilterSlice.actions

export default productFilterSlice.reducer