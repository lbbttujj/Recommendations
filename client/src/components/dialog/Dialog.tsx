import { Button } from '@vkontakte/vkui'
import React, { ReactElement } from 'react'

import styles from './dialog.module.less'

type DialogProps = {
	children: ReactElement
	buttonText: string
	buttonAction: () => void
	closeDialog: () => void
}
export const Dialog: React.FC<DialogProps> = ({
	children,
	buttonText,
	buttonAction,
	closeDialog,
}) => {
	return (
		<div onClick={() => closeDialog()} className={styles.modalView}>
			<div
				onClick={(event) => event.stopPropagation()}
				className={styles.dialogWrapper}
			>
				{children}
				<div className={styles.actionBtn}>
					<Button
						style={{ height: '100%' }}
						stretched={true}
						onClick={buttonAction}
					>
						{buttonText}
					</Button>
				</div>
			</div>
		</div>
	)
}
