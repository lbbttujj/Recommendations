import { createSlice } from '@reduxjs/toolkit'

import { getFilmCard } from './actions'

// Define a type for the slice state
interface FilmsState {
	title: string
	kpId: number | null
	poster: string
}

// Define the initial state using that type
const initialState: FilmsState = {
	title: '',
	kpId: null,
	poster: '',
}

export const filmsSlice = createSlice({
	name: 'films',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getFilmCard.fulfilled, (state, action) => {
			state.title = action.payload.title
			state.kpId = action.payload.kpId
			state.poster = action.payload.poster
		})
	},
})

// Other code such as selectors can use the imported `RootState` type
export default filmsSlice.reducer
