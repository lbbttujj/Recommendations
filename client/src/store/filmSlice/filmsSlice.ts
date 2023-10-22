import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Film = {
	title: string
	kpId: number | null
	poster: string
}

interface FilmsState {
	searchPage: Film
	directoryPage: Film
	friendPage: Film
	recommend: Film
}

const filmInitialState: Film = {
	title: '',
	kpId: null,
	poster: '',
}
const initialState: FilmsState = {
	searchPage: filmInitialState,
	directoryPage: filmInitialState,
	friendPage: filmInitialState,
	recommend: filmInitialState,
}

export const filmsSlice = createSlice({
	name: 'films',

	initialState,
	reducers: {
		setSearchPageFilmCard: (state, action: PayloadAction<Film>) => {
			state.searchPage = action.payload
		},
		setFriendPageFilmCard: (state, action: PayloadAction<Film>) => {
			state.friendPage = action.payload
		},
		setDirectoryPageFilmCard: (state, action: PayloadAction<Film>) => {
			state.directoryPage = action.payload
		},
		setRecommendFilmCard: (state, action: PayloadAction<Film>) => {
			state.recommend = action.payload
		},
	},
})

export const {
	setSearchPageFilmCard,
	setFriendPageFilmCard,
	setDirectoryPageFilmCard,
	setRecommendFilmCard,
} = filmsSlice.actions
export default filmsSlice.reducer
