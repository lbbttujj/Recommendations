import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { Icon16Dropdown, Icon24Back } from '@vkontakte/icons'
import {
	Cell,
	List,
	PanelHeader,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
} from '@vkontakte/vkui'
import { useAppDispatch } from 'hooks'
import React from 'react'
import { DirectoryType, DirState } from 'store/types'

import styles from './toolbarDeafult.module.less'

type ToolbarProps = {
	currentDir: DirState
	setDir: ActionCreatorWithPayload<{ dirId: string; dirName: string }>
	title?: string
	menuOpened: boolean
	setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
	toggleContext: () => void
	directories?: DirectoryType[]
	children?: React.ReactNode
	customBack?: React.ReactNode
}

export const ToolbarDefault: React.FC<ToolbarProps> = ({
	currentDir,
	setDir,
	title,
	menuOpened,
	setMenuOpened,
	toggleContext,
	directories,
	children,
	customBack,
}) => {
	console.log('currentDir', currentDir)
	const dispatch = useAppDispatch()
	return (
		<>
			<PanelHeader>
				<div className={styles.header}>
					{currentDir.dirId && (
						<PanelHeaderButton
							className={styles.backBtn}
							onClick={() => {
								dispatch(setDir({ dirId: '', dirName: '' }))
							}}
						>
							<Icon24Back />
						</PanelHeaderButton>
					)}
					{!currentDir.dirName && customBack}
					{currentDir.dirName ? (
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
							{title ? `${currentDir.dirName} (${title})` : currentDir.dirName}
						</PanelHeaderContent>
					) : (
						<PanelHeaderContent>
							<p>{title || 'Мои папки'}</p>
						</PanelHeaderContent>
					)}
					{children}
				</div>
			</PanelHeader>
			<PanelHeaderContext opened={menuOpened} onClose={toggleContext}>
				<List>
					{directories &&
						directories.map((dir) => (
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
		</>
	)
}
