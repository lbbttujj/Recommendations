import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useAppDispatch } from 'hooks'
import React from 'react'

import styles from '../directory.module.less'

type DirectoryPreviewProps = {
	dirName: string
	dirId: string
	setDir: ActionCreatorWithPayload<{ dirId: string; dirName: string }>
	setSelectedDirectories?: React.Dispatch<React.SetStateAction<string[]>>
}
export const Preview: React.FC<DirectoryPreviewProps> = ({
	dirName,
	dirId,
	setDir,
	setSelectedDirectories,
}) => {
	const dispatch = useAppDispatch()
	const chooseDirectory = () => {
		dispatch(setDir({ dirId, dirName }))
	}
	return (
		<div
			onContextMenu={(event) => {
				event.preventDefault()
				setSelectedDirectories &&
					setSelectedDirectories((state) => {
						const newState = [...state]
						newState.push(dirId)
						return newState
					})
			}}
			onClick={chooseDirectory}
			className={styles.preview}
		>
			<div className={styles.previewName}>{dirName}</div>
		</div>
	)
}
