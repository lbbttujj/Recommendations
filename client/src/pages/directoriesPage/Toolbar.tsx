import { useLazyQuery, useMutation } from '@apollo/client'
import { Icon28SettingsOutline } from '@vkontakte/icons'
import { Input, Text } from '@vkontakte/vkui'
import { Dialog } from 'components/dialog/Dialog'
import { ToolbarDefault } from 'components/directory/toolbar/ToolbarDefault'
import { useAppDispatch } from 'hooks'
import React, { ReactElement, useContext, useState } from 'react'
import { setDir } from 'store/dirSlice/dirSlice'
import { DirectoryType, FilmType } from 'store/types'

import {
	ADD_DIR,
	CLEAR_DIR,
	DELETE_DIR,
	DELETE_FILMS,
	GET_FiLMS,
} from '../../graphql/dbQuery'
import { IdContext } from '../../userIdContext'
import { ActionSheetComponent } from './components/ActionSheet'
import styles from './directoriesPage.module.less'

type ToolbarProps = {
	currentDir: any
	setPopout: React.Dispatch<React.SetStateAction<ReactElement | null>>
	directories?: DirectoryType[]
	baseRef: React.MutableRefObject<null>
	updateDirectories: () => void
	setMessage: React.Dispatch<React.SetStateAction<string>>
}

export const Toolbar: React.FC<ToolbarProps> = ({
	currentDir,
	setPopout,
	directories,
	baseRef,
	updateDirectories,
	setMessage,
}) => {
	const [menuOpened, setMenuOpened] = useState<boolean>(false)
	const [newDirName, setNewDirName] = useState('')
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] =
		React.useState(false)

	const [addDir] = useMutation(ADD_DIR)
	const [deleteDir] = useMutation(DELETE_DIR)
	const [_, { refetch: updateFilms }] = useLazyQuery<
		{ getFilms: FilmType[] },
		{ dirId: string }
	>(GET_FiLMS)
	const [clearDir] = useMutation(CLEAR_DIR)

	const userId = useContext(IdContext)
	const dispatch = useAppDispatch()

	const toggleContext = () => {
		setMenuOpened((prev) => !prev)
	}

	const openActionSheet = () => {
		setPopout(
			<ActionSheetComponent
				onClose={() => setPopout(null)}
				baseRef={baseRef}
				setIsCreateGroupDialogOpen={setIsCreateGroupDialogOpen}
				deleteDirectoryHandler={deleteDirectoryHandler}
				clearDirectoryHandler={clearDirectoryHandler}
			/>
		)
	}
	const addDirectoryHandler = () => {
		addDir({ variables: { input: { dirName: newDirName, userId: userId } } })
			.then(() => {
				setIsCreateGroupDialogOpen(false)
				setNewDirName('')
				updateDirectories()
				setMessage('Группа успешно добавлена')
			})
			.catch((e: Error) => {
				setMessage(e.message)
			})
	}

	const deleteDirectoryHandler = () => {
		deleteDir({
			variables: {
				input: { dirId: currentDir.dirId },
			},
		})
			.then(() => {
				updateDirectories()
				dispatch(setDir({ dirName: '', dirId: '' }))
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const clearDirectoryHandler = () => {
		clearDir({ variables: { input: { dirId: currentDir.dirId } } }).then(() => {
			updateFilms({ dirId: currentDir.dirId }).then(() => {
				setMessage('Папка очищена')
			})
		})
	}

	return (
		<>
			<ToolbarDefault
				setDir={setDir}
				currentDir={currentDir}
				menuOpened={menuOpened}
				toggleContext={toggleContext}
				directories={directories}
				setMenuOpened={setMenuOpened}
			>
				<div className={styles.settingsIcon}>
					<Icon28SettingsOutline onClick={() => openActionSheet()} />
				</div>
			</ToolbarDefault>
			{isCreateGroupDialogOpen && (
				<Dialog
					buttonText='Создать группу'
					closeDialog={() => setIsCreateGroupDialogOpen(false)}
					buttonAction={() => addDirectoryHandler()}
				>
					<>
						<Text>Введите название папки</Text>
						<Input
							onChange={(event) => setNewDirName(event.target.value)}
							value={newDirName}
						/>
					</>
				</Dialog>
			)}
		</>
	)
}
