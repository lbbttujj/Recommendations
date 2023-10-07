import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DirState } from '../types'

const initialState: DirState = {
	dirId: '',
	dirName: '',
}

export const friendDirSlice = createSlice({
	name: 'directories',
	initialState,
	reducers: {
		setFriendDir: (
			state,
			action: PayloadAction<{ dirId: string; dirName: string }>
		) => {
			state.dirId = action.payload.dirId
			state.dirName = action.payload.dirName
		},
	},
})

export const { setFriendDir } = friendDirSlice.actions

export default friendDirSlice.reducer
