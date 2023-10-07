import { useLazyQuery, useMutation } from '@apollo/client'
import { Button, Group, Panel, ScreenSpinner, Search } from '@vkontakte/vkui'
import { Directory } from 'components/directory/Directory'
import { useAppSelector, useGetDirectories, useSnackBar } from 'hooks'
import React, {
	ChangeEvent,
	ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react'
import { setDir } from 'store/dirSlice/dirSlice'
import { FilmType } from 'store/types'

import { DeleteBar } from '../../components/deleteBar/DeleteBar'
import { PreviewDirectories } from '../../components/directory/previewDirectories.tsx/PreviewDirectories'
import { DELETE_FILM, GET_FiLMS } from '../../graphql/dbQuery'
import { setDirectoryPageFilmCard } from '../../store/filmSlice/filmsSlice'
import styles from './directoriesPage.module.less'
import { Toolbar } from './Toolbar'

type DirectoriesProps = {
	id: string
	setPopout: React.Dispatch<React.SetStateAction<ReactElement | null>>
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
	setActiveModal: React.Dispatch<React.SetStateAction<string | null>>
}

export const DirectoriesPage: React.FC<DirectoriesProps> = ({
	id,
	setPopout,
	changeDirPanel,
	setActiveModal,
}) => {
	const { Snackbar, setMessage } = useSnackBar()
	const [searchValue, setSearchValue] = useState('')
	const [films, setFilms] = useState<FilmType[]>([])
	const [mode, setMode] = useState<'removable' | 'selectable'>()
	const [isDeleteBarOpen, setIsDeleteBarOpen] = useState(false)
	const [selectedDirectories, setSelectedDirectories] = useState<string[]>([])

	const baseRef = useRef(null)

	const currentDir = useAppSelector((state) => state.directories)

	const { directories, refetch: updateDirectories } = useGetDirectories()
	const [getFilmsFromDir, { data: filmsState, loading, refetch: updateFilms }] =
		useLazyQuery<{ getFilms: FilmType[] }, { dirId: string }>(GET_FiLMS)

	const [deleteFilm] = useMutation(DELETE_FILM)

	const deleteFilmHandler = (filmId: string) => {
		deleteFilm({ variables: { filmId: filmId } })
			.then((r) => {
				updateDirectories({ dirId: currentDir.dirId })
			})
			.catch((e) => console.log(e))
	}

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		const currentSearchValue = event.target.value
		setSearchValue(currentSearchValue)
		setFilms((prev) => {
			if (!currentSearchValue) {
				return filmsState?.getFilms || []
			}
			return prev.filter((el) =>
				el.name.toLowerCase().includes(currentSearchValue.toLowerCase())
			)
		})
	}

	useEffect(() => {
		updateFilms({ dirId: currentDir.dirId }).then(() => {
			updateDirectories()
		})
	}, [currentDir, getFilmsFromDir, updateDirectories])

	useEffect(() => {
		if (filmsState?.getFilms) {
			setFilms(filmsState.getFilms)
		}
	}, [filmsState])

	return (
		<Panel id={id} getRootRef={baseRef} className={styles.directoriesPagePanel}>
			{
				<Toolbar
					currentDir={currentDir}
					setPopout={setPopout}
					directories={directories}
					baseRef={baseRef}
					updateDirectories={updateDirectories}
					setMessage={setMessage}
				/>
			}
			{currentDir.dirId && (
				<Group>
					<Search
						value={searchValue}
						onChange={handleSearchChange}
						after={null}
					/>
				</Group>
			)}
			<Group>
				{loading && <ScreenSpinner size={'large'} />}
				{currentDir.dirId ? (
					<Directory
						id={currentDir.dirId}
						changeDirPanel={changeDirPanel}
						films={films}
						setMessage={setMessage}
						viewPanelName='dirFilm'
						mode={mode}
						setMode={setMode}
						setActiveModal={setActiveModal}
						setFilmCard={setDirectoryPageFilmCard}
					/>
				) : (
					<PreviewDirectories
						setSelectedDirectories={setSelectedDirectories}
						directories={directories}
						setDir={setDir}
					/>
				)}
			</Group>
			<DeleteBar
				deleteHandler={() => console.log('delete')}
				selected={selectedDirectories}
				isOpen={isDeleteBarOpen}
				setIsOpen={setIsDeleteBarOpen}
			/>
			{Snackbar}
		</Panel>
	)
}
