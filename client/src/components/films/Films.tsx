import { useMutation } from '@apollo/client'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { Icon28AddCircleOutline } from '@vkontakte/icons'
import { Group } from '@vkontakte/vkui'
import { useAppDispatch, useLazyGetDirectories } from 'hooks'
import React from 'react'
import { addToFavorite } from 'utils/addToFavorite'

import { ADD_FILM_TO_DIR } from '../../graphql/dbQuery'
import { Film } from '../../store/filmSlice/filmsSlice'
import styles from './films.module.less'

type FilmsProps = {
	id: number
	name: string
	shortDescription: string
	poster: {
		previewUrl: string
	}
	changeViewPanel: React.Dispatch<React.SetStateAction<string>>
	addToDirectory?: ({
		kpId,
		imgUrl,
		name,
	}: {
		kpId: number
		imgUrl: string
		name: string
	}) => void
	setMessage: React.Dispatch<React.SetStateAction<string>>
	viewPanelName: string
	mode?: 'selectable' | 'removable'
	setFilmCard: ActionCreatorWithPayload<Film>
}
export const Films: React.FC<FilmsProps> = ({
	id,
	name,
	shortDescription,
	poster,
	addToDirectory,
	changeViewPanel,
	setMessage,
	viewPanelName,
	mode,
	setFilmCard,
}) => {
	const openFilmCard = () => {
		changeViewPanel(viewPanelName)
		dispatch(
			setFilmCard({
				title: name,
				kpId: id,
				poster: poster.previewUrl,
			})
		)
	}

	const dispatch = useAppDispatch()
	const [addFilmToGroup] = useMutation(ADD_FILM_TO_DIR)
	const { execute: executeDir } = useLazyGetDirectories()

	return (
		<Group>
			<div
				onClick={() => {
					!mode && openFilmCard()
				}}
				className={styles.filmWrapper}
			>
				<img src={poster.previewUrl} className={styles.image} />
				<div className={styles.title}>
					<span>{name}</span>
					<span
						style={{ position: 'relative', left: '10px' }}
						onClick={(event) => {
							event.stopPropagation()
							name &&
								addToFavorite({
									executeDir,
									addFilmToGroup,
									kpId: id,
									poster: poster.previewUrl,
									title: name,
								})
									.then(() => {
										setMessage('Фильм добавлен в избранное')
									})
									.catch((error) => {
										setMessage(error?.message || 'Что-то пошло не так')
									})
						}}
					>
						♡
					</span>
					<span
						onClick={(event) => {
							event.stopPropagation()
							addToDirectory &&
								addToDirectory({ kpId: id, imgUrl: poster.previewUrl, name })
						}}
						className={styles.addToDir}
					>
						<Icon28AddCircleOutline />
					</span>
				</div>
				<p className={styles.description}> {shortDescription}</p>
			</div>
		</Group>
	)
}
