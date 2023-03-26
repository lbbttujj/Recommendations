import React, { ReactElement, useEffect } from 'react'

import styles from './snackbar.module.less'

type SnackbarProps = {
	children?: ReactElement
	isSnackBarVisible: boolean
	setIsSnackBarVisible: React.Dispatch<React.SetStateAction<boolean>>
	duration?: number
	text?: string
}
export const Snackbar: React.FC<SnackbarProps> = ({
	children,
	setIsSnackBarVisible,
	isSnackBarVisible,
	duration = 1500,
	text,
}) => {
	useEffect(() => {
		if (isSnackBarVisible) {
			setTimeout(() => {
				setIsSnackBarVisible(false)
			}, duration)
		}
	}, [isSnackBarVisible])
	return (
		<div className={styles.snackbarWrapper}>
			<div
				style={{ opacity: isSnackBarVisible ? '100%' : '0' }}
				className={styles.snackbar}
			>
				{text && <p>{text}</p>}
				{children && children}
			</div>
		</div>
	)
}
