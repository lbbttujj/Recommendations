import '@vkontakte/vkui/dist/vkui.css'

import bridge from '@vkontakte/vk-bridge'
import {
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	Epic,
	SplitCol,
	SplitLayout,
	View,
} from '@vkontakte/vkui'
import React, { ReactElement, useEffect, useState } from 'react'

import { TabBarComponent } from './components/tabbar/Tabbar'
import { DirectoriesPage } from './pages/directoriesPage/DirectoriesPage'
import { FilmPage } from './pages/filmPage/FilmPage'
import { SearchPage } from './pages/searchPage/SearchPage'

export type PagesType = 'searchPage' | 'directories'

const App = () => {
	const [activeStory, setActiveStory] = React.useState<PagesType>('searchPage')

	// eslint-disable-next-line no-unused-vars
	const [_user, setUser] = useState(null)
	const [popout, setPopout] = useState<ReactElement | null>(null)
	const [dirActivePanel, setDirActivePanel] = useState<string>('directories')
	const [searchActivePanel, setSearchActivePanel] =
		useState<string>('searchPage')

	useEffect(() => {
		fetchData()
	}, [])

	async function fetchData() {
		const user = await bridge.send('VKWebAppGetUserInfo')
		// @ts-ignore
		setUser(user)
	}

	const onStoryChange = (e: React.MouseEvent<HTMLElement>) => {
		if (e.currentTarget.dataset.story) {
			setActiveStory(e.currentTarget.dataset.story as PagesType)
		}
	}

	return (
		<ConfigProvider appearance={'light'}>
			<AdaptivityProvider>
				<AppRoot mode={'partial'}>
					<SplitLayout popout={popout}>
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
								<View id='directories' activePanel={dirActivePanel}>
									<DirectoriesPage
										id='directories'
										changeDirPanel={setDirActivePanel}
										setPopout={setPopout}
									/>
									<FilmPage
										id='film'
										title='test'
										idFilm={'1102'}
										back={() => setDirActivePanel('directories')}
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
										title='test'
										idFilm={'1102'}
										back={() => setSearchActivePanel('searchPage')}
									/>
								</View>
							</Epic>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	)
}

export default App
