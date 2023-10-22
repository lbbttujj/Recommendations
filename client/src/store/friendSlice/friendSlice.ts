import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Friends } from '../../pages/socialPage/types'
interface FriendState {
	firstName: string
	id: number
}

const initialState: FriendState = {
	firstName: '',
	id: 0,
}

export const friendSlice = createSlice({
	name: 'friend',
	initialState,
	reducers: {
		setCurrentFriend: (state, action: PayloadAction<Friends>) => {
			state.firstName = action.payload.first_name
			state.id = action.payload.id
		},
	},
})

export const { setCurrentFriend } = friendSlice.actions

export default friendSlice.reducer
