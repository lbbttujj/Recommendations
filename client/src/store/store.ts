import { configureStore } from '@reduxjs/toolkit'

import dirReducer from './dirSlice/dirSlice'
import filmsReducer from './filmSlice/filmsSlice'
import searchReducer from './searchSlice/searchSlice'
// ...

export const store = configureStore({
	reducer: {
		films: filmsReducer,
		directories: dirReducer,
		search: searchReducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
