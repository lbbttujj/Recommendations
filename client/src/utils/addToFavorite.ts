import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'

import { DirectoryType } from '../store/types'

export const addToFavorite = ({
	executeDir,
	kpId,
	poster,
	title,
	addFilmToGroup,
}: {
	executeDir: LazyQueryExecFunction<
		{ getDirectories: DirectoryType[] },
		OperationVariables
	>
	addFilmToGroup: (params: any) => Promise<any>
	kpId: number
	poster: string
	title: string
}) => {
	return new Promise((resolve, reject) => {
		executeDir()
			.then((directories) => {
				const favoriteDirId = directories.data?.getDirectories.filter(
					(dir) => dir.dir_type === 'Favorite'
				)[0].id
				if (favoriteDirId && kpId) {
					addFilmToGroup({
						variables: {
							input: {
								dirId: favoriteDirId,
								kpId,
								imgUrl: poster,
								name: title,
							},
						},
					})
						.then(() => {
							resolve('success')
						})
						.catch((reason) => {
							reject(reason)
						})
				}
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
