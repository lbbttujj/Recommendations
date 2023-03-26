import { useLazyQuery, useMutation } from '@apollo/client'
import { ScreenSpinner } from '@vkontakte/vkui'
import React, { useEffect } from 'react'

import { DELETE_FILM, GET_FiLMS } from '../../graphql/dbQuery'
import { useAppSelector } from '../../hooks'
import { Films } from '../films/Films'
import styles from './directory.module.less'

export type DirectoryTypeProps = {
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
}

type FilmType = {
	id: string
	kp_id: number
	dir_id: string
	img_url: string
	name: string
	description: string
}
export const Directory: React.FC<DirectoryTypeProps> = ({ changeDirPanel }) => {
	const dir = useAppSelector((state) => state.directories)

	const [getFilmsFromDir, { data, loading, refetch }] = useLazyQuery<
		{ getFilms: FilmType[] },
		{ dirId: string }
	>(GET_FiLMS)

	useEffect(() => {
		getFilmsFromDir({
			variables: { dirId: dir.dirId },
		})
	}, [dir])

	const [deleteFilm] = useMutation(DELETE_FILM)

	const deleteFilmHandler = (filmId: string) => {
		deleteFilm({ variables: { filmId: filmId } })
			.then((r) => {
				console.log('success')
				refetch({ dirId: dir.dirId })
			})
			.catch((e) => console.log(e))
	}

	return (
		<div className={styles.directory}>
			{loading && <ScreenSpinner size={'large'} />}
			{data &&
				data.getFilms.map((film) => (
					<div className={styles.dirFilmWrapper}>
						<span
							onClick={(event) => {
								event.stopPropagation()
								deleteFilmHandler(film.id)
							}}
							className={styles.closeIcon}
						>
							x
						</span>
						<Films
							id={film.kp_id}
							name={film.name}
							shortDescription={film.description}
							poster={{ url: film.img_url }}
							changeViewPanel={changeDirPanel}
						/>
					</div>
				))}
		</div>
	)
}
