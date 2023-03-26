import { Icon28AddCircleOutline } from '@vkontakte/icons'
import React from 'react'

import { useAppDispatch } from '../../hooks'
import { getFilmCard } from '../../store/filmSlice/actions'
import styles from './films.module.less'

export type FilmsType = {
	id: number
	name: string
	shortDescription: string
	poster: {
		url: string
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
	addToFavorite?: ({
		kpId,
		imgUrl,
		name,
	}: {
		kpId: number
		imgUrl: string
		name: string
	}) => void
}
export const Films: React.FC<FilmsType> = ({
	id,
	name,
	shortDescription,
	poster,
	addToDirectory,
	addToFavorite,
	changeViewPanel,
}) => {
	const openFilmCard = () => {
		changeViewPanel('film')
		dispatch(getFilmCard({ title: name, kpId: id, poster: poster.url }))
	}

	const dispatch = useAppDispatch()

	return (
		<div onClick={openFilmCard} className={styles.filmWrapper}>
			<img src={poster.url} className={styles.image} />
			<div className={styles.title}>
				<span>{name}</span>
				<span
					style={{ position: 'relative', left: '10px' }}
					onClick={(event) => {
						event.stopPropagation()
						addToFavorite &&
							addToFavorite({ kpId: id, imgUrl: poster.url, name })
					}}
				>
					♡
				</span>
				<span
					onClick={(event) => {
						event.stopPropagation()
						addToDirectory &&
							addToDirectory({ kpId: id, imgUrl: poster.url, name })
					}}
					className={styles.addToDir}
				>
					<Icon28AddCircleOutline />
				</span>
			</div>
			<p className={styles.description}> {shortDescription}</p>
		</div>
	)
}
