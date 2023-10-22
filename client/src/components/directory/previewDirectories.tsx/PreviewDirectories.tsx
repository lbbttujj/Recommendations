import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import React from 'react'

import { DirectoryType } from '../../../store/types'
import { Preview } from './Preview'
import styles from './Preview.module.less'

type PreviewDirectoriesProps = {
	directories?: DirectoryType[]
	setDir: ActionCreatorWithPayload<{ dirId: string; dirName: string }>
	setSelectedDirectories?: React.Dispatch<React.SetStateAction<string[]>>
}

export const PreviewDirectories: React.FC<PreviewDirectoriesProps> = ({
	directories,
	setDir,
	setSelectedDirectories,
}) => {
	return (
		<div className={styles.previews}>
			{directories?.length ? (
				directories.map((dir) => (
					<Preview
						setSelectedDirectories={setSelectedDirectories}
						dirName={dir.dir_name}
						dirId={dir.id}
						setDir={setDir}
					/>
				))
			) : (
				<div className={styles.noFolders}>Папок пока нет</div>
			)}
		</div>
	)
}
