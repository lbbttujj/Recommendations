import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { FilmsType } from '../../components/films/Films'

interface SearchState {
	searchValue: string
	films: FilmsType[]
}

const initialState: SearchState = {
	searchValue: '',
	films: [],
}

export const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		setStateSearchValue: (state, action: PayloadAction<string>) => {
			state.searchValue = action.payload
		},
		setStateFilms: (state, action: PayloadAction<FilmsType[]>) => {
			state.films = action.payload
		},
	},
})

export const { setStateSearchValue, setStateFilms } = searchSlice.actions

export default searchSlice.reducer
