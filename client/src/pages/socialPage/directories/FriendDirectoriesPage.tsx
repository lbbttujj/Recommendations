import { useLazyQuery } from '@apollo/client'
import { Group, Panel, Search } from '@vkontakte/vkui'
import { Directory } from 'components/directory/Directory'
import { PreviewDirectories } from 'components/directory/previewDirectories.tsx/PreviewDirectories'
import { useAppSelector, useGetDirectories, useSnackBar } from 'hooks'
import React, {
	ChangeEvent,
	ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react'
import { setFriendDir } from 'store/friendDirSlice/friendDirSlice'
import { FilmType } from 'store/types'

import { GET_FiLMS } from '../../../graphql/dbQuery'
import {
	setDirectoryPageFilmCard,
	setFriendPageFilmCard,
} from '../../../store/filmSlice/filmsSlice'
import { FriendToolbar } from './FriendToolbar'

type DirectoriesProps = {
	id: string
	setPopout: React.Dispatch<React.SetStateAction<ReactElement | null>>
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
}

export const FriendDirectoriesPage: React.FC<DirectoriesProps> = ({
	id,
	setPopout,
	changeDirPanel,
}) => {
	const [searchValue, setSearchValue] = useState('')
	const [films, setFilms] = useState<FilmType[]>([])

	const { Snackbar, setMessage } = useSnackBar()

	const baseRef = useRef(null)
	const currentDir = useAppSelector((state) => state.friendDirectories)
	const currentFriend = useAppSelector((state) => state.friend)
	const { directories, refetch: updateDirectories } = useGetDirectories(
		currentFriend.id
	)
	const [getFilmsFromDir, { data: filmsState, loading }] = useLazyQuery<
		{ getFilms: FilmType[] },
		{ dirId: string }
	>(GET_FiLMS)

	useEffect(() => {
		getFilmsFromDir({
			variables: { dirId: currentDir.dirId },
		}).then(() => {
			updateDirectories()
		})
	}, [currentDir, getFilmsFromDir, updateDirectories])

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
		if (filmsState?.getFilms) {
			setFilms(filmsState.getFilms)
		}
	}, [filmsState])

	return (
		<Panel id={id} getRootRef={baseRef}>
			<FriendToolbar
				changeDirPanel={changeDirPanel}
				currentDir={currentDir}
				directories={directories}
				title={`${currentFriend.firstName}`}
			/>
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
				{currentDir.dirId ? (
					<Directory
						changeDirPanel={changeDirPanel}
						films={films}
						setMessage={setMessage}
						viewPanelName={'friendFilm'}
						setFilmCard={setFriendPageFilmCard}
					/>
				) : (
					<PreviewDirectories directories={directories} setDir={setFriendDir} />
				)}
			</Group>
			{Snackbar}
		</Panel>
	)
}
