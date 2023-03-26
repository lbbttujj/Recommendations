//@ts-nocheck

import { useMutation, useQuery } from '@apollo/client'
import { Icon16Dropdown, Icon28SettingsOutline } from '@vkontakte/icons'
import {
	ActionSheet,
	ActionSheetDefaultIosCloseItem,
	ActionSheetItem,
	Cell,
	Group,
	Input,
	List,
	Panel,
	PanelHeader,
	PanelHeaderContent,
	PanelHeaderContext,
	Search,
	Text,
} from '@vkontakte/vkui'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

import { Dialog } from '../../components/dialog/Dialog'
import { Directory } from '../../components/directory/Directory'
import { Snackbar } from '../../components/snackbar/Snackbar'
import { ADD_DIR, DELETE_DIR, GET_DIRECTORIES } from '../../graphql/dbQuery'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setDir } from '../../store/dirSlice/dirSlice'
import styles from './directoriesPage.module.less'

type DirectoriesProps = {
	id: string
	setPopout: React.Dispatch<React.SetStateAction<ReactElement | null>>
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
}

export const DirectoriesPage: React.FC<DirectoriesProps> = ({
	id,
	setPopout,
	changeDirPanel,
}) => {
	const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] =
		React.useState(false)
	const [newDirName, setNewDirName] = useState('')

	const [menuOpened, setMenuOpened] = useState<boolean>(false)
	const [directories, setDirectories] = useState<Directory[]>([])
	const [isCreateDirSBVisible, setIsCreateDirSBVisible] = useState(false)
	const baseRef = useRef(null)
	const currentDir = useAppSelector((state) => state.directories)
	const { data, refetch } = useQuery<{ getDirectories: Directory[] }>(
		GET_DIRECTORIES,
		{
			variables: {
				userId: 1,
			},
		}
	)
	const [addDir] = useMutation(ADD_DIR)
	const [deleteDir] = useMutation(DELETE_DIR)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (data) {
			setDirectories(data.getDirectories)
		}
	}, [data])

	const toggleContext = () => {
		setMenuOpened((prev) => !prev)
	}

	const addDirectoryHandler = () => {
		addDir({ variables: { input: { dirName: newDirName, userId: 1 } } })
			.then(() => {
				setIsCreateGroupDialogOpen(false)
				setNewDirName('')
				refetch()
				setIsCreateDirSBVisible(true)
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const onClose = () => {
		setPopout(null)
	}

	const deleteDirectoryHandler = () => {
		deleteDir({
			variables: {
				input: { dirId: currentDir.dirId },
			},
		})
			.then(() => {
				refetch()
				dispatch(setDir({ dirName: '', id: '' }))
			})
			.catch((error) => alert(error))
	}

	const openActionSheet = () => {
		setPopout(
			<ActionSheet
				onClose={onClose}
				iosCloseItem={<ActionSheetDefaultIosCloseItem />}
				toggleRef={baseRef}
			>
				<ActionSheetItem
					onClick={() => {
						setIsCreateGroupDialogOpen(true)
					}}
					autoClose
				>
					Добавить папку
				</ActionSheetItem>
				<ActionSheetItem autoClose>Переименовать папку</ActionSheetItem>
				<ActionSheetItem
					onClick={() => deleteDirectoryHandler()}
					autoClose
					mode='destructive'
				>
					Удалить папку
				</ActionSheetItem>
			</ActionSheet>
		)
	}

	// @ts-ignore
	return (
		<Panel id={id} getRootRef={baseRef} style={{ marginBottom: '15px' }}>
			<PanelHeader>
				<div className={styles.header}>
					<PanelHeaderContent
						aside={
							<Icon16Dropdown
								style={{
									transform: `rotate(${menuOpened ? '180deg' : '0'})`,
								}}
							/>
						}
						onClick={toggleContext}
					>
						{currentDir.dirName ? currentDir.dirName : 'Выберите папку'}
					</PanelHeaderContent>
					<div className={styles.settingsIcon}>
						<Icon28SettingsOutline onClick={() => openActionSheet()} />
					</div>
				</div>
			</PanelHeader>
			<PanelHeaderContext opened={menuOpened} onClose={toggleContext}>
				<List>
					{directories.map((dir) => (
						<Cell
							onClick={() => {
								dispatch(setDir({ dirId: dir.id, dirName: dir.dir_name }))
								setMenuOpened(false)
							}}
						>
							{dir.dir_name}
						</Cell>
					))}
				</List>
			</PanelHeaderContext>

			<Group>
				<div style={{ display: 'flex' }}>
					<Search value='' onChange={() => console.log('ddd')} after={null} />
					<div>филтьтр</div>
				</div>
			</Group>
			<Group>
				<Directory
					changeDirPanel={changeDirPanel}
					dir_name={currentDir.dirName}
					id={currentDir.id}
				/>
			</Group>
			{isCreateGroupDialogOpen && (
				<Dialog
					buttonText='Создать группу'
					closeDialog={() => setIsCreateGroupDialogOpen(false)}
					buttonAction={() => addDirectoryHandler()}
				>
					<Text>Введите название папки</Text>
					<Input
						onChange={(event) => setNewDirName(event.target.value)}
						value={newDirName}
					/>
				</Dialog>
			)}
			<Snackbar
				isSnackBarVisible={isCreateDirSBVisible}
				setIsSnackBarVisible={setIsCreateDirSBVisible}
				text={'Группа успешно добавлена'}
			/>
		</Panel>
	)
}
