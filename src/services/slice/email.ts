import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: {email:string} = {
  email: "",
}
const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setEmail(state, action) {        
      state.email = action.payload
    },
  },
  extraReducers: (builder) => {},
})

export const {
  setEmail,
} = authSlice.actions

export default authSlice