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
import React, { ReactElement, useEffect, useRef, useState } from 'react'

import { Films, FilmsType } from '../../components/films/Films'
import { Snackbar } from '../../components/snackbar/Snackbar'
import { ADD_FILM_TO_DIR, GET_DIRECTORIES } from '../../graphql/dbQuery'
import { SEARCH_FILMS } from '../../graphql/kpQuery'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
	setStateFilms,
	setStateSearchValue,
} from '../../store/searchSlice/searchSlice'
import { Directory } from '../directoriesPage/types'
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
	const [films, setFilms] = useState<FilmsType[]>([])
	const [isSnackBarVisible, setIsSnackBarVisible] = useState(false)
	const baseRef = useRef(null)
	const dispatch = useAppDispatch()

	const stateSearch = useAppSelector((state) => state.search)

	const [execute, { data, loading }] = useLazyQuery<{
		getKpFilms: FilmsType[]
	}>(SEARCH_FILMS)

	const [executeDir = execute] = useLazyQuery<{
		getDirectories: Directory[]
	}>(GET_DIRECTORIES, {
		variables: {
			userId: 1,
		},
	})

	const [addFilmToGroup] = useMutation(ADD_FILM_TO_DIR)

	useEffect(() => {
		if (data) {
			setFilms(data.getKpFilms)
			dispatch(setStateFilms(data.getKpFilms))
			dispatch(setStateSearchValue(searchValue))
		}
	}, [data])

	useEffect(() => {
		if (stateSearch.films.length > 0) {
			setFilms(stateSearch.films)
			setSearchValue(stateSearch.searchValue)
		}
	}, [stateSearch])

	const handleChangeSearch = (value: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(value.target.value)
	}

	const handleSearch = () => {
		execute({ variables: { value: searchValue } })
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
					{
						// @ts-ignore
						res.data?.getDirectories.map((dir) => (
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
										setIsSnackBarVisible(true)
									})
								}
							>
								{dir.dir_name}
							</ActionSheetItem>
						))
					}
				</ActionSheet>
			)
		})
	}

	const addToFavorite = ({
		kpId,
		imgUrl,
		name,
	}: {
		kpId: number
		imgUrl: string
		name: string
	}) => {
		addFilmToGroup({
			variables: {
				input: {
					dirId: '58577ff6-ccb2-4a2e-9a22-0966b2b411cd',
					kpId,
					imgUrl,
					name,
				},
			},
		}).then((el) => {
			console.log(el)
			setIsSnackBarVisible(true)
		})
	}

	const onClose = () => {
		setPopout(null)
	}

	return (
		<Panel id={id} style={{ marginBottom: '15px' }} getRootRef={baseRef}>
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
							addToFavorite={addToFavorite}
							addToDirectory={addToDirectory}
							changeViewPanel={changeSearchPanel}
						/>
					)
				})}
			</Group>
			<Snackbar
				isSnackBarVisible={isSnackBarVisible}
				setIsSnackBarVisible={setIsSnackBarVisible}
			>
				<p>Фильм добавлен в избранное</p>
			</Snackbar>
		</Panel>
	)
}
