import { Icon24Back } from '@vkontakte/icons'
import { PanelHeaderButton } from '@vkontakte/vkui'
import { ToolbarDefault } from 'components/directory/toolbar/ToolbarDefault'
import React, { useState } from 'react'
import { setFriendDir } from 'store/friendDirSlice/friendDirSlice'
import { DirectoryType, DirState } from 'store/types'

import styles from '../../directoriesPage/directoriesPage.module.less'

type ToolbarProps = {
	currentDir: DirState
	directories?: DirectoryType[]
	changeDirPanel: React.Dispatch<React.SetStateAction<string>>
	title?: string
}

export const FriendToolbar: React.FC<ToolbarProps> = ({
	currentDir,
	directories,
	changeDirPanel,
	title,
}) => {
	const [menuOpened, setMenuOpened] = useState<boolean>(false)
	const toggleContext = () => {
		setMenuOpened((prev) => !prev)
	}

	const backToFriends = (
		<PanelHeaderButton
			className={styles.backBtn}
			onClick={() => {
				changeDirPanel('socialPage')
			}}
		>
			<Icon24Back />
		</PanelHeaderButton>
	)

	return (
		<>
			<ToolbarDefault
				currentDir={currentDir}
				setDir={setFriendDir}
				title={title}
				menuOpened={menuOpened}
				setMenuOpened={setMenuOpened}
				toggleContext={toggleContext}
				directories={directories}
				customBack={backToFriends}
			></ToolbarDefault>
		</>
	)
}
