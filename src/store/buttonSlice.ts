import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    current_id: -1,
}

const buttonSlice = createSlice({
    name: 'button',
    initialState: initialState,
    reducers: {
        updateButton: (state, action) => {
            state.current_id = action.payload.SendingId
            console.log(action.payload)
        },
        cleanButton: (state) => {
            state.current_id = -1
        }
    }
})

export const { updateButton, cleanButton } = buttonSlice.actions

export default buttonSlice.reducer