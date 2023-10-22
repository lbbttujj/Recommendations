import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { FilmType } from '../types'

interface SearchState {
	films: FilmType[]
}

const initialState: SearchState = {
	films: [],
}

export const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		setStateFilms: (state, action: PayloadAction<FilmType[]>) => {
			state.films = action.payload
		},
	},
})

export const { setStateFilms } = searchSlice.actions

export default searchSlice.reducer
