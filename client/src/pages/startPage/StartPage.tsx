import { useMutation } from '@apollo/client'
import { UserInfo } from '@vkontakte/vk-bridge'
import { Button } from '@vkontakte/vkui'
import React, { useEffect } from 'react'

import { ADD_USER } from '../../graphql/dbQuery'
import styles from './startPage.module.less'

type StartPageProps = {
	vkId?: number
	userName?: string
	setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>
}

export const StartPage: React.FC<StartPageProps> = ({
	userName,
	vkId,
	setUser,
}) => {
	const [addUser, { data }] = useMutation(ADD_USER)
	useEffect(() => {
		console.log(data)
	}, [data])

	const registrate = () => {
		if (vkId && userName) {
			addUser({
				variables: {
					input: {
						vkId: vkId,
						userName: userName,
					},
				},
			}).then((el) => {
				setUser(el.data.addUser.vk_id)
			})
		}
	}

	return (
		<div className={styles.startPage}>
			<h1>Pidor</h1>
			<Button onClick={registrate}>Войти</Button>
		</div>
	)
}
