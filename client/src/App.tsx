import '@vkontakte/vkui/dist/vkui.css'

import { useLazyQuery } from '@apollo/client'
import bridge, { UserInfo } from '@vkontakte/vk-bridge'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useAppDispatch } from 'hooks'
import React, { useEffect, useState } from 'react'

import { GET_USER } from './graphql/dbQuery'
import { StartPage } from './pages/startPage/StartPage'
import { Recommendations } from './Recommendations'
import { setAccessToken } from './store/userSlice/userSlice'
import { IdContext } from './userIdContext'

const App = () => {
	const [user, setUser] = useState<UserInfo | null>(null)
	useState<string>('searchPage')
	const [getUser, { data: userData, loading }] = useLazyQuery(GET_USER)
	const dispatch = useAppDispatch()

	useEffect(() => {
		fetchUserData()
	}, [])

	bridge
		.send('VKWebAppGetAuthToken', {
			app_id: 8040117,
			scope: 'friends,status',
		})
		.then((data) => {
			if (data.access_token) {
				dispatch(setAccessToken(data.access_token))
			}
		})
		.catch((error) => {
			// Ошибка
			console.log(error)
		})

	useEffect(() => {
		getUser({
			variables: {
				vkId: user?.id,
			},
		})
	}, [user])

	async function fetchUserData() {
		const user = (await bridge.send('VKWebAppGetUserInfo')) as UserInfo
		setUser(user)
	}

	if (loading) {
		return <ScreenSpinner />
	}

	if (userData && userData.getUser) {
		return (
			<IdContext.Provider value={user?.id ? user?.id : null}>
				<Recommendations />
			</IdContext.Provider>
		)
	} else {
		return (
			<StartPage
				vkId={user?.id}
				userName={user?.first_name}
				setUser={setUser}
			/>
		)
	}
}

export default App
