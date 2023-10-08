import { useLazyQuery, useMutation } from '@apollo/client'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { Cell, Group } from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'
import { FilmType } from 'store/types'

import { DELETE_FILM, DELETE_FILMS, GET_FiLMS } from '../../graphql/dbQuery'
import { Film } from '../../store/filmSlice/filmsSlice'
import { DeleteBar } from '../deleteBar/DeleteBar'
import { Films } from '../films/Films'
import styles from './directory.module.less'

export type DirectoryTypeProps = {
	id?: string
	isModeChangeable?: boolean
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
	films: FilmType[]
	setMessage: React.Dispatch<React.SetStateAction<string>>
	mode?: 'removable' | 'selectable'
	setMode?: React.Dispatch<
		React.SetStateAction<'removable' | 'selectable' | undefined>
	>
	viewPanelName: string
	setActiveModal?: React.Dispatch<React.SetStateAction<string | null>>
	setFilmCard: ActionCreatorWithPayload<Film>
}

export const Directory: React.FC<DirectoryTypeProps> = ({
	id,
	isModeChangeable = true,
	changeDirPanel,
	films,
	setMessage,
	viewPanelName,
	setMode,
	mode,
	setActiveModal,
	setFilmCard,
}) => {
	const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [currentFilms, setCurrentFilms] = useState<FilmType[]>([])
	const [isDeleteBarOpen, setIsDeleteBarOpen] = useState(false)
	const [deleteFilms] = useMutation(DELETE_FILMS)
	const [_, { refetch: updateFilms }] = useLazyQuery<
		{ getFilms: FilmType[] },
		{ dirId: string }
	>(GET_FiLMS)

	useEffect(() => {
		setCurrentFilms(films)
	}, [films])

	const onContextmenuHandler = (
		event: React.MouseEvent<HTMLElement>,
		filmId: string
	) => {
		event.preventDefault()
		setMode && setMode('selectable')
		selectHandler(filmId)
	}

	const deleteHandler = () => {
		deleteFilms({
			variables: {
				input: { filmIds: selectedItems },
			},
		}).then(() => {
			setSelectedItems([])
			setMessage('Фильмы удалены')
			updateFilms({ dirId: id || '' }).then((res) => {
				res.data?.getFilms && setCurrentFilms(res.data?.getFilms)
			})
		})
	}

	const selectHandler = (id: string) => {
		setSelectedItems((prev) => {
			const newState = [...prev]
			if (newState.filter((el) => el === id).length !== 0) {
				return newState.filter((el) => el !== id)
			}
			newState.push(id)
			return newState
		})
	}

	useEffect(() => {
		console.log(currentFilms)
	}, [currentFilms])

	useEffect(() => {
		if (selectedItems.length) {
			setIsDeleteBarOpen(true)
		} else {
			setIsDeleteBarOpen(false)
			setMode && setMode(undefined)
		}
	}, [selectedItems])

	const getColor = (id: string) => {
		if (selectedItems.find((el) => el === id)) {
			return 'gray'
		}
		return 'white'
	}

	return (
		<div className={styles.directory}>
			<Group>
				{!currentFilms.length && <div>Тут ничего пока нет</div>}
				{currentFilms.map((film) => (
					<Cell
						onChange={(event) => selectHandler(film.id)}
						mode={mode}
						style={{ backgroundColor: getColor(film.id) }}
						className={styles.dirFilmWrapper}
						onContextMenu={(event) =>
							isModeChangeable && onContextmenuHandler(event, film.id)
						}
					>
						<Films
							id={film.kp_id}
							name={film.name}
							shortDescription={film.description}
							poster={{ previewUrl: film.img_url }}
							changeViewPanel={changeDirPanel}
							mode={mode}
							setMessage={setMessage}
							viewPanelName={viewPanelName}
							setFilmCard={setFilmCard}
						/>
					</Cell>
				))}
			</Group>
			<DeleteBar
				deleteHandler={deleteHandler}
				selected={selectedItems}
				isOpen={isDeleteBarOpen}
				setIsOpen={setIsDeleteBarOpen}
			/>
		</div>
	)
}
