import { createSlice } from "@reduxjs/toolkit"


interface Filter {
    searchValue: string,
}

const initialState: Filter = {
    searchValue: "",
}

const productFilterSlice = createSlice({
    name: 'productFilter',
    initialState: initialState,
    reducers: {
        updateSearchValue(state, action) {
            state.searchValue = action.payload
        },
        cleanValues(state) {
            state.searchValue = ""
        },
    }
})

export const { updateSearchValue, cleanValues} = productFilterSlice.actions

export default productFilterSlice.reducer