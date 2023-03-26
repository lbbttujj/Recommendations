import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DirState {
	dirId: string
	dirName: string
}

const initialState: DirState = {
	dirId: '',
	dirName: '',
}

export const dirSlice = createSlice({
	name: 'directories',
	initialState,
	reducers: {
		setDir: (
			state,
			action: PayloadAction<{ dirId: string; dirName: string }>
		) => {
			state.dirId = action.payload.dirId
			state.dirName = action.payload.dirName
		},
	},
})

export const { setDir } = dirSlice.actions

export default dirSlice.reducer
