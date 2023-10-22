import {
	Avatar,
	Cell,
	Group,
	Panel,
	PanelHeader,
	Search,
	Text,
} from '@vkontakte/vkui'
import { useAppDispatch } from 'hooks'
import React, { useState } from 'react'

import { setCurrentFriend } from '../../store/friendSlice/friendSlice'
import { useGetFriends } from './hooks'
import type { Friends } from './types'

type SocialPageProps = {
	id: string
	changeSocialPanel: React.Dispatch<React.SetStateAction<string>>
}

export const SocialPage: React.FC<SocialPageProps> = ({
	id,
	changeSocialPanel,
}) => {
	const friends = useGetFriends()
	const dispatch = useAppDispatch()
	const [searchValue, setSearchValue] = useState<string>('')
	const gotToFriendDirs = (friend: Friends) => {
		console.log(friend)
		dispatch(setCurrentFriend(friend))
		changeSocialPanel('friendDirectories')
	}

	const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value)
	}

	return (
		<Panel id={id}>
			<PanelHeader>Друзья</PanelHeader>
			<Search value={searchValue} onChange={searchHandler} after={null} />
			<Group>
				{friends &&
					friends
						.filter((el) =>
							el.first_name.toLowerCase().includes(searchValue.toLowerCase())
						)
						.map((friend) => {
							return (
								<Cell
									before={<Avatar src={friend.photo_50} />}
									onClick={() => gotToFriendDirs(friend)}
									key={friend.id}
								>
									<Text>{friend.first_name}</Text>
								</Cell>
							)
						})}
			</Group>
		</Panel>
	)
}
