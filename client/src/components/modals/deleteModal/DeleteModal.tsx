import { ModalPage, ModalPageHeader, PanelHeaderClose } from '@vkontakte/vkui'
import React from 'react'

type DeleteModalProps = {
	id: string
	onClose: () => void
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ id, onClose }) => {
	return (
		<ModalPage
			id={id}
			header={
				<ModalPageHeader
					before={<PanelHeaderClose onClick={onClose} />}
				></ModalPageHeader>
			}
		></ModalPage>
	)
}
