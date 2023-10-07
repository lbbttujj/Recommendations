import { useMutation } from '@apollo/client'
import bridge from '@vkontakte/vk-bridge'
import { Button, Cell } from '@vkontakte/vkui'
import {
	Avatar,
	Group,
	ModalPage,
	ModalPageHeader,
	PanelHeaderClose,
} from '@vkontakte/vkui'
import { useAppSelector } from 'hooks'
import React, { useEffect, useState } from 'react'

import { RECOMMEND } from '../../../graphql/dbQuery'
import styles from './recommendModal.module.less'

type RecommendModalProps = {
	id: string
	onClose: () => void
	setMessage: React.Dispatch<React.SetStateAction<string>>
}

export const RecommendModal: React.FC<RecommendModalProps> = ({
	onClose,
	id,
	setMessage,
}) => {
	const [appUsers, setAppUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState<number[]>([])
	const access_token = useAppSelector((state) => state.user.access_token)
	const { kpId, poster, title } = useAppSelector(
		(state) => state.films.recommend
	)
	const [recommend] = useMutation(RECOMMEND)

	useEffect(() => {
		getAppUsers()
	}, [])

	const getAppUsers = () => {
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
						setAppUsers(data.response.items)
					}
				})
		}
	}

	const sendRecommendation = () => {
		recommend({
			variables: {
				input: {
					usersIds: [99483935], //todo : selectedUsers
					name: title,
					kpId,
					imgUrl: poster,
					description: '',
				},
			},
		}).then((res) => {
			if (res) {
				onClose()
				setMessage('Рекомендация отправлена')
			}
		})
	}

	return (
		<ModalPage
			id={id}
			header={
				<ModalPageHeader before={<PanelHeaderClose onClick={onClose} />}>
					Рекоммендовать
				</ModalPageHeader>
			}
		>
			<Group className={styles.recommendModuleContent}>
				<div className={styles.appUsers}>
					{appUsers.map((user) => {
						return (
							<Cell
								mode={'selectable'}
								// @ts-ignore
								before={<Avatar src={user.photo_50} />}
								// @ts-ignore
								key={user.id}
								onChange={(event) => {
									if ((event.target as HTMLInputElement).checked) {
										setSelectedUsers((prev) => {
											// @ts-ignore
											prev.push(user.id)
											return prev
										})
									} else {
										setSelectedUsers((prev) => {
											// @ts-ignore
											return prev.filter((id) => id !== user.id)
										})
									}
								}}
							>
								{
									// @ts-ignore
									user.first_name
								}
							</Cell>
						)
					})}
				</div>
				<div className={styles.actionButton}>
					<Button
						onClick={sendRecommendation}
						style={{ width: '98%' }}
						size={'m'}
					>
						Отправить
					</Button>
				</div>
			</Group>
		</ModalPage>
	)
}
