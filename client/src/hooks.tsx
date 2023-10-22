import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from 'store'

import { Snackbar } from './components/snackbar/Snackbar'
import { GET_DIRECTORIES } from './graphql/dbQuery'
import { DirectoryType } from './store/types'
import { IdContext } from './userIdContext'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useGetDirectories = (friendId?: number) => {
	const userId = useContext(IdContext)
	const { data, refetch } = useQuery<{
		getDirectories: DirectoryType[]
	}>(GET_DIRECTORIES, {
		variables: {
			userId: friendId || userId,
		},
	})
	const directories = data?.getDirectories
	return { directories, refetch }
}

export const useLazyGetDirectories = () => {
	const userId = useContext(IdContext)
	const [execute] = useLazyQuery<{
		getDirectories: DirectoryType[]
	}>(GET_DIRECTORIES, {
		variables: {
			userId: userId,
		},
	})
	return { execute }
}

export const useDebounce = (fn: () => void) => {
	setTimeout(() => {
		fn()
	}, 300)
}

export const useSnackBar = () => {
	const [isSnackBarVisible, setIsSnackBarVisible] = useState(false)
	const [message, setMessage] = useState('')
	useEffect(() => {
		if (message) {
			setIsSnackBarVisible(true)
		}
	}, [message])

	const SnackbarComponent = (
		<Snackbar
			isSnackBarVisible={isSnackBarVisible}
			setIsSnackBarVisible={setIsSnackBarVisible}
			setMessage={setMessage}
			message={message}
		/>
	)

	return { Snackbar: SnackbarComponent, setMessage }
}
