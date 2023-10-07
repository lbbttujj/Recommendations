import bridge from '@vkontakte/vk-bridge'
import { useAppSelector } from 'hooks'
import { useEffect, useState } from 'react'

import type { Friends } from '../types'

export const useGetFriends = () => {
	const access_token = useAppSelector((state) => state.user.access_token)
	const [friends, setFriends] = useState<Friends[]>([])

	// Удалить
	useEffect(() => {
		const me = {
			can_access_closed: true,
			first_name: 'lbbttjj',
			id: 99483935,
			is_closed: false,
			last_name: 'yo',
			photo_50:
				'https://sun1-89.userapi.com/s/v1/ig2/KxC6oH3XWyoafCsbdKY76b6zlf8lFElagQTHT0lVwHURpogLABcUhjzDAGbWI5QryXkBz3cK0zc8shegzSkRvNjY.jpg?size=100x100&quality=95&crop=0,0,680,680&ava=1',
			track_code: 'smth',
		}
		if (friends.length > 0 && !friends.find((el) => el.id === 99483935)) {
			setFriends((prev) => {
				return [...prev, me]
			})
		}
	}, [friends])
	// Удалить

	useEffect(() => {
		if (access_token) {
			bridge
				.send('VKWebAppCallAPIMethod', {
					method: 'friends.get',
					params: {
						v: '5.131',
						fields: 'photo_50',
						count: 10,
						access_token,
					},
				})
				.then((data) => {
					if (data?.response?.items) {
						setFriends(data.response.items)
					}
				})
		}
	}, [access_token])
	return friends
}
