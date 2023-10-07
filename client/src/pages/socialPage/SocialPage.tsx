import { Avatar, Cell, Group, Panel, PanelHeader, Text } from '@vkontakte/vkui'
import { useAppDispatch } from 'hooks'
import React from 'react'

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
	const gotToFriendDirs = (friend: Friends) => {
		console.log(friend)
		dispatch(setCurrentFriend(friend))
		changeSocialPanel('friendDirectories')
	}

	return (
		<Panel id={id}>
			<PanelHeader>Друзья</PanelHeader>
			<Group>
				{friends &&
					friends.map((friend) => {
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
