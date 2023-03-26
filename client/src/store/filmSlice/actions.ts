import { createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../store'

type outFilm = {
	title: string
	kpId: number
	poster: string
}
type inFilm = {
	title: string
	kpId: number
	poster: string
}

export const getFilmCard = createAsyncThunk<
	outFilm,
	inFilm,
	{ state: RootState }
>('film/getFilmCard', async ({ title, poster, kpId }, thunkAPI) => {
	return { title, poster, kpId }
})
