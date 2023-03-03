import { Panel, PanelHeader } from '@vkontakte/vkui'
import React from 'react'

import styles from './Directories.module.less'

type DirectoriesProps = {
	id: string
}

export const Directories: React.FC<DirectoriesProps> = ({ id }) => {
	return (
		<Panel id={id}>
			<PanelHeader>FRONTEND</PanelHeader>
			<div className={styles.wdwdwd}>
				<h2>OK, I'M WAITING</h2>
			</div>
		</Panel>
	)
}
