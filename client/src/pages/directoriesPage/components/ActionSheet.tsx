import {
	ActionSheet,
	ActionSheetDefaultIosCloseItem,
	ActionSheetItem,
} from '@vkontakte/vkui'
import React from 'react'

type ActionSheetProps = {
	onClose: any
	baseRef: any
	setIsCreateGroupDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
	deleteDirectoryHandler: () => void
	clearDirectoryHandler: () => void
}

export const ActionSheetComponent: React.FC<ActionSheetProps> = ({
	onClose,
	baseRef,
	setIsCreateGroupDialogOpen,
	deleteDirectoryHandler,
	clearDirectoryHandler,
}) => {
	return (
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
			<ActionSheetItem onClick={() => clearDirectoryHandler()} autoClose>
				Очистить папку
			</ActionSheetItem>
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
