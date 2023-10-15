import { useLazyQuery, useMutation } from '@apollo/client'
import { Icon24Back } from '@vkontakte/icons'
import {
	Card,
	CardScroll,
	Gallery,
	Panel,
	PanelHeaderButton,
} from '@vkontakte/vkui'
import { ReactComponent as ArrowDown } from 'assets/img/arrowDown.svg'
import { ReactComponent as FavoriteIcon } from 'assets/img/favoriteIcon.svg'
import { ReactComponent as RecommendIcon } from 'assets/img/recommendIcon.svg'
import {
	useAppDispatch,
	useAppSelector,
	useLazyGetDirectories,
	useSnackBar,
} from 'hooks'
import React, { useEffect } from 'react'
import { setRecommendFilmCard } from 'store/filmSlice/filmsSlice'
import { addToFavorite } from 'utils/addToFavorite'

import { ADD_FILM_TO_DIR } from '../../graphql/dbQuery'
import { GET_FILM_DETAILS } from '../../graphql/kpQuery'
import styles from './filmPage.module.less'

type FilmPageProps = {
	id: string
	back: () => void
	page: 'searchPage' | 'directoryPage' | 'friendPage'
	setActiveModal: React.Dispatch<React.SetStateAction<string | null>>
}

export const FilmPage: React.FC<FilmPageProps> = ({
	id,
	back,
	page = 'searchPage',
	setActiveModal,
}) => {
	const { poster, title, kpId } = useAppSelector((state) => state.films[page])
	//todo: temporary
	const [getFilmDetails, { data }] = useLazyQuery(GET_FILM_DETAILS)
	const { Snackbar, setMessage } = useSnackBar()

	const dispatch = useAppDispatch()

	useEffect(() => {
		console.log(kpId)
		getFilmDetails({
			variables: {
				kpId: kpId,
			},
		})
	}, [kpId])

	const [addFilmToGroup] = useMutation(ADD_FILM_TO_DIR)
	const { execute: executeDir } = useLazyGetDirectories()

	const openRecommendModal = () => {
		dispatch(setRecommendFilmCard({ title, poster, kpId: Number(kpId) }))
		setActiveModal('recommend')
	}

	return (
		<Panel id={id}>
			<div className={styles.panelHeader}>
				<PanelHeaderButton className={styles.backBtn} onClick={back}>
					<Icon24Back />
				</PanelHeaderButton>
			</div>
			<div className={styles.filmPage}>
				<div className={styles.filmImage}>
					<img src={poster} />
					<div className={styles.arrowDown}>
						<ArrowDown />
					</div>
				</div>
				<div className={styles.title}>
					<h3>{title}</h3>
				</div>
				{data && (
					<>
						<div className={styles.description}>
							<p>{data.getFilmDetails.description}</p>
						</div>
						<div
							onClick={() =>
								addToFavorite({
									executeDir,
									addFilmToGroup,
									kpId: kpId as number,
									poster,
									title,
								})
									.then(() => {
										setMessage('Фильм добавлен в избранное')
									})
									.catch((error) => {
										setMessage(error?.message || 'Что-то пошло не так')
									})
							}
							className={styles.favoriteIcon}
						>
							<FavoriteIcon />
						</div>
						<div
							onClick={() => openRecommendModal()}
							className={styles.recommendIcon}
						>
							<RecommendIcon />
						</div>
						<div className={styles.watchability}>
							<p>Где посомотреть</p>
							<div className={styles.watchabilityItems}>
								{data.getFilmDetails.watchability.items &&
									data.getFilmDetails.watchability.items.map((el: any) => (
										<div>
											<a href={el.url}>
												<img width='40px' src={el.logo.url} />
											</a>
										</div>
									))}
							</div>
						</div>
						<div className={styles.trailers}>
							<div className={styles.title}>
								<p>Трейлеры</p>
							</div>
							<CardScroll size={'l'}>
								{data.getFilmDetails.videos.trailers.map((el: any) => (
									<Card className={styles.trailer}>
										<iframe
											width='100%'
											height='250px'
											src={el.url}
											title='YouTube video player'
											allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
											allowFullScreen
										/>
									</Card>
								))}
							</CardScroll>
						</div>
					</>
				)}
			</div>
			{Snackbar}
		</Panel>
	)
}
