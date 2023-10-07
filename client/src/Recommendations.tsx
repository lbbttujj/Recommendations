import {
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	Epic,
	ModalRoot,
	SplitCol,
	SplitLayout,
	View,
} from '@vkontakte/vkui'
import { useSnackBar } from 'hooks'
import React, { ReactElement, useState } from 'react'

import { DeleteModal } from './components/modals/deleteModal/DeleteModal'
import { RecommendModal } from './components/modals/recommendModal/RecommendModal'
import { TabBarComponent } from './components/tabbar/Tabbar'
import { DirectoriesPage } from './pages/directoriesPage/DirectoriesPage'
import { FilmPage } from './pages/filmPage/FilmPage'
import { SearchPage } from './pages/searchPage/SearchPage'
import { FriendDirectoriesPage } from './pages/socialPage/directories/FriendDirectoriesPage'
import { SocialPage } from './pages/socialPage/SocialPage'

export const Recommendations = () => {
	type PagesType = 'searchPage' | 'directories' | 'socialPage'

	const [activeStory, setActiveStory] = React.useState<PagesType>('searchPage')

	const [popout, setPopout] = useState<ReactElement | null>(null)
	const [activeModal, setActiveModal] = useState<string | null>(null)
	const [dirActivePanel, setDirActivePanel] = useState<string>('directories')
	const { Snackbar, setMessage } = useSnackBar()
	const [searchActivePanel, setSearchActivePanel] =
		useState<string>('searchPage')
	const [socialActivePanel, setSocialActivePanel] =
		useState<string>('socialPage')

	const onStoryChange = (e: React.MouseEvent<HTMLElement>) => {
		if (e.currentTarget.dataset.story) {
			setActiveStory(e.currentTarget.dataset.story as PagesType)
		}
	}

	const modal = (
		<ModalRoot activeModal={activeModal}>
			<RecommendModal
				id='recommend'
				onClose={() => setActiveModal(null)}
				setMessage={setMessage}
			/>
			<DeleteModal id={'delete'} onClose={() => setActiveModal(null)} />
		</ModalRoot>
	)

	return (
		<ConfigProvider appearance={'light'}>
			<AdaptivityProvider>
				<AppRoot mode={'partial'}>
					<SplitLayout popout={popout} modal={modal}>
						<SplitCol
							width='100%'
							maxWidth='560px'
							stretchedOnMobile
							autoSpaced
						>
							<Epic
								activeStory={activeStory}
								tabbar={
									<TabBarComponent
										onStoryChange={onStoryChange}
										activeStory={activeStory}
									/>
								}
							>
								<View id='socialPage' activePanel={socialActivePanel}>
									<SocialPage
										id='socialPage'
										changeSocialPanel={setSocialActivePanel}
									/>
									<FriendDirectoriesPage
										id='friendDirectories'
										changeDirPanel={setSocialActivePanel}
										setPopout={setPopout}
									/>
									<FilmPage
										id='friendFilm'
										back={() => setSocialActivePanel('friendDirectories')}
										page='friendPage'
										setActiveModal={setActiveModal}
									/>
								</View>
								<View id='directories' activePanel={dirActivePanel}>
									<DirectoriesPage
										id='directories'
										changeDirPanel={setDirActivePanel}
										setPopout={setPopout}
										setActiveModal={setActiveModal}
									/>
									<FilmPage
										id='dirFilm'
										back={() => setDirActivePanel('directories')}
										page='directoryPage'
										setActiveModal={setActiveModal}
									/>
								</View>
								<View id='searchPage' activePanel={searchActivePanel}>
									<SearchPage
										id='searchPage'
										setPopout={setPopout}
										changeSearchPanel={setSearchActivePanel}
									/>
									<FilmPage
										id='film'
										back={() => setSearchActivePanel('searchPage')}
										page='searchPage'
										setActiveModal={setActiveModal}
									/>
								</View>
							</Epic>
						</SplitCol>
					</SplitLayout>
					{Snackbar}
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	)
}
