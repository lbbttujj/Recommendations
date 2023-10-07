import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface UserState {
	access_token: string | null
}

const initialState: UserState = {
	access_token: null,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.access_token = action.payload
		},
		// setStateSearchValue: (state, action: PayloadAction<string>) => {
		//     state.searchValue = action.payload
		// },
	},
})

export const { setAccessToken } = userSlice.actions

export default userSlice.reducer
