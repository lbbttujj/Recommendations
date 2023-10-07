import { Button } from '@vkontakte/vkui'
import React from 'react'

import styles from './deleteBar.module.less'

type DeleteBarProps = {
	isOpen: boolean
	setIsOpen: (value: boolean) => void
	deleteHandler: () => void
	selected: string[]
}

export const DeleteBar: React.FC<DeleteBarProps> = ({
	isOpen,
	setIsOpen,
	deleteHandler,
	selected,
}) => {
	if (isOpen) {
		return (
			<div className={styles.deleteBar}>
				<div>Выбранно элементов:{selected.length}</div>
				<Button
					onClick={() => {
						deleteHandler()
						setIsOpen(false)
					}}
				>
					Удалить
				</Button>
			</div>
		)
	}
	return null
}
