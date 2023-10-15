import { useMutation } from '@apollo/client'
import bridge from '@vkontakte/vk-bridge'
import { Button, Cell, Search } from '@vkontakte/vkui'
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
import { VkUsers } from '../../../store/types'
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
	const [appUsers, setAppUsers] = useState<Array<VkUsers>>([])
	const [searchValue, setSearchValue] = useState<string>('')
	const [selectedUsers, setSelectedUsers] = useState<
		Array<{ userId: number; userName: string }>
	>([])
	const access_token = useAppSelector((state) => state.user.access_token)
	const { kpId, poster, title } = useAppSelector(
		(state) => state.films.recommend
	)
	const [recommend] = useMutation(RECOMMEND)

	const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value)
	}

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
					usersInfo: selectedUsers,
					name: title,
					kpId,
					imgUrl: poster,
					description: '',
				},
			},
		})
			.then((res) => {
				if (res) {
					onClose()
					setMessage('Рекомендация отправлена')
				}
			})
			.catch((res) => {
				onClose()
				setMessage(res?.message || 'Что-то пошло не так')
			})
	}

	return (
		<ModalPage
			id={id}
			header={
				<>
					<ModalPageHeader before={<PanelHeaderClose onClick={onClose} />}>
						Рекомендовать
					</ModalPageHeader>
					<Search value={searchValue} onChange={searchHandler} after={null} />
				</>
			}
		>
			<Group className={styles.recommendModuleContent}>
				<div className={styles.appUsers}>
					{appUsers
						.filter((el) =>
							el.first_name.toLowerCase().includes(searchValue.toLowerCase())
						)
						.map((user) => {
							return (
								<Cell
									mode={'selectable'}
									before={<Avatar src={user.photo_50} />}
									key={user.id}
									onChange={(event) => {
										if ((event.target as HTMLInputElement).checked) {
											setSelectedUsers((prev) => {
												prev.push({
													userId: user.id,
													userName: user.first_name,
												})
												return prev
											})
										} else {
											setSelectedUsers((prev) => {
												return prev.filter(({ userId }) => userId !== user.id)
											})
										}
									}}
								>
									{user.first_name}
								</Cell>
							)
						})}
				</div>
				<div className={styles.actionButton}>
					<Button
						className={styles.sendButton}
						onClick={sendRecommendation}
						size={'m'}
					>
						Отправить
					</Button>
				</div>
			</Group>
		</ModalPage>
	)
}
