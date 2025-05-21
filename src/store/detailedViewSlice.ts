import { createSlice } from '@reduxjs/toolkit'

interface DetailedViewState {
  isDetailed: boolean
}

const initialState: DetailedViewState = {
  isDetailed: false
}

const detailedViewSlice = createSlice({
  name: 'detailedView',
  initialState,
  reducers: {
    toggleDetailed: (state) => {
      state.isDetailed = !state.isDetailed
    }
  }
})

export const { toggleDetailed } = detailedViewSlice.actions
export default detailedViewSlice.reducer