import { configureStore } from '@reduxjs/toolkit'

import dirReducer from './dirSlice/dirSlice'
import filmsReducer from './filmSlice/filmsSlice'
import friendDirSlice from './friendDirSlice/friendDirSlice'
import friendSlice from './friendSlice/friendSlice'
import searchReducer from './searchSlice/searchSlice'
import userReducer from './userSlice/userSlice'
// ...

export const store = configureStore({
	reducer: {
		films: filmsReducer,
		directories: dirReducer,
		friendDirectories: friendDirSlice,
		search: searchReducer,
		user: userReducer,
		friend: friendSlice,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
