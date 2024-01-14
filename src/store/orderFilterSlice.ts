import { createSlice } from "@reduxjs/toolkit"

interface Filter {
    P: boolean
    A: boolean
    W: boolean
    startDate: Date | undefined
    endDate: Date | undefined
    username: string
}

const initialState: Filter = {
    P: true,
    A: true,
    W: true,
    startDate: undefined,
    endDate: undefined,
    username: ""
}

export const getBeginOfDay = (date: Date) => {
    if (date == null || !date || date.getTime() == 0) {
        return undefined
    }
    const newStartDate = new Date(date);
    newStartDate.setHours(0);
    newStartDate.setMinutes(0);
    newStartDate.setSeconds(0);
    return newStartDate;
}

export const getEndOfDay = (date: Date) => {
    const newEndDate = new Date(date);
    if (date == null || !date || date.getTime() == 0) {
        return undefined
    }
    newEndDate.setHours(23);
    newEndDate.setMinutes(59);
    newEndDate.setSeconds(59);
    return newEndDate;
}

const orderFilterSlice = createSlice({
    name: 'orderFilter',
    initialState: initialState,
    reducers: {
        updateP(state, action) {
            state.P = action.payload
        },
        updateA(state, action) {
            state.A = action.payload
        },
        updateW(state, action) {
            state.W = action.payload
        },
        updateStartDate(state, action) {
            state.startDate = getBeginOfDay(action.payload)
        },
        updateEndDate(state, action) {
            state.endDate = getEndOfDay(action.payload)
        },
        updateUsername(state, action) {
            state.username = action.payload
        },
        cleanOrderFilter(state) {
            state.P = true
            state.A = true
            state.W = true
            state.startDate = undefined
            state.endDate = undefined
            state.username = ""
        }
    }
})

export const { updateP, updateA, updateW, updateStartDate, updateEndDate, updateUsername, cleanOrderFilter } = orderFilterSlice.actions
export default orderFilterSlice.reducer