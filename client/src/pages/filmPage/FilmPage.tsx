import { Icon24Back } from '@vkontakte/icons'
import { Panel, PanelHeaderButton } from '@vkontakte/vkui'
import React from 'react'

import { useAppSelector } from '../../hooks'
import styles from './filmPage.module.less'

type FilmPageProps = {
	id: string
	title: string
	idFilm: string
	back: () => void
}

export const FilmPage: React.FC<FilmPageProps> = ({
	id,
	title,
	idFilm,
	back,
}) => {
	const currentFilm = useAppSelector((state) => state.films)

	return (
		<Panel id={id}>
			<div className={styles.panelHeader}>
				<PanelHeaderButton className={styles.backBtn} onClick={back}>
					<Icon24Back />
				</PanelHeaderButton>
			</div>
			<div className={styles.filmPage}>
				<div className={styles.filmImage}>
					<img src={currentFilm.poster} />
				</div>
				<h3>{currentFilm.title}</h3>
			</div>
		</Panel>
	)
}
