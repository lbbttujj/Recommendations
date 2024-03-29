import { useLazyQuery, useMutation } from '@apollo/client'
import {
	ActionSheet,
	ActionSheetDefaultIosCloseItem,
	ActionSheetItem,
	Button,
	Group,
	Panel,
	PanelHeader,
	ScreenSpinner,
	Search,
} from '@vkontakte/vkui'
import { Films } from 'components/films/Films'
import {
	useAppDispatch,
	useAppSelector,
	useLazyGetDirectories,
	useSnackBar,
} from 'hooks'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { setStateFilms } from 'store/searchSlice/searchSlice'

import { ADD_FILM_TO_DIR } from '../../graphql/dbQuery'
import { SEARCH_FILMS } from '../../graphql/kpQuery'
import { setSearchPageFilmCard } from '../../store/filmSlice/filmsSlice'
import { Film2Type, FilmType } from '../../store/types'
import styles from './searchPage.module.less'

type SearchPageType = {
	id: string
	setPopout: React.Dispatch<React.SetStateAction<ReactElement | null>>
	changeSearchPanel: React.Dispatch<React.SetStateAction<string>>
}

export const SearchPage: React.FC<SearchPageType> = ({
	id,
	setPopout,
	changeSearchPanel,
}) => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [films, setFilms] = useState<Film2Type[]>([])
	const { Snackbar, setMessage } = useSnackBar()

	const baseRef = useRef(null)

	const stateSearch = useAppSelector((state) => state.search)

	const [searchFilms, { data, loading }] = useLazyQuery<{
		getKpFilms: FilmType[]
	}>(SEARCH_FILMS)
	const { execute: executeDir } = useLazyGetDirectories()
	const [addFilmToGroup] = useMutation(ADD_FILM_TO_DIR)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (data) {
			// @ts-ignore
			setFilms(data.getKpFilms)
			dispatch(setStateFilms(data.getKpFilms))
		}
	}, [data])

	useEffect(() => {
		if (stateSearch.films.length > 0) {
			// @ts-ignore
			setFilms(stateSearch.films)
		}
	}, [stateSearch])

	const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const currentSearchValue = event.target.value
		setSearchValue(currentSearchValue)
	}

	const handleSearch = () => {
		searchFilms({ variables: { value: searchValue } }).catch((error: Error) => {
			setMessage(error.message)
		})
	}

	const addToDirectory = ({
		kpId,
		imgUrl,
		name,
	}: {
		kpId: number
		imgUrl: string
		name: string
	}) => {
		executeDir().then((res) => {
			setPopout(
				<ActionSheet
					onClose={onClose}
					iosCloseItem={<ActionSheetDefaultIosCloseItem />}
					toggleRef={baseRef}
				>
					{res.data?.getDirectories.map((dir) => (
						<ActionSheetItem
							autoClose={true}
							onClick={() =>
								addFilmToGroup({
									variables: {
										input: {
											dirId: dir.id,
											kpId,
											imgUrl,
											name,
										},
									},
								}).then((res) => {
									setMessage('Фильм успешно добавлен в группу')
								})
							}
						>
							{dir.dir_name}
						</ActionSheetItem>
					))}
				</ActionSheet>
			)
		})
	}

	const onClose = () => {
		setPopout(null)
	}

	return (
		<Panel id={id} getRootRef={baseRef}>
			<PanelHeader>Поиск</PanelHeader>
			<div style={{ display: 'flex' }}>
				<Search
					value={searchValue}
					onChange={handleChangeSearch}
					after={null}
				/>
			</div>
			<div className={styles.searchBtn}>
				<Button onClick={handleSearch} stretched={true}>
					Найти
				</Button>
			</div>
			<Group className={styles.filmsContent}>
				{loading && <ScreenSpinner size={'large'} />}
				{films.map((film) => {
					return (
						<Films
							id={film.id}
							name={film.name}
							shortDescription={film.shortDescription}
							poster={film.poster}
							addToDirectory={addToDirectory}
							changeViewPanel={changeSearchPanel}
							setMessage={setMessage}
							viewPanelName={'film'}
							setFilmCard={setSearchPageFilmCard}
						/>
					)
				})}
			</Group>
			{Snackbar}
		</Panel>
	)
}
