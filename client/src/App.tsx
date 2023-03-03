import '@vkontakte/vkui/dist/vkui.css'

import bridge from '@vkontakte/vk-bridge'
import {
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	ScreenSpinner,
	SplitCol,
	SplitLayout,
	View,
} from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'

import { Directories } from './components/Directories/Directories'

const App = () => {
	const [activePanel, setActivePanel] = useState('directories')
	const [user, setUser] = useState(null)

	useEffect(() => {
		fetchData()
	}, [])

	async function fetchData() {
		const user = await bridge.send('VKWebAppGetUserInfo')
		// @ts-ignore
		setUser(user)
	}

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={activePanel}>
						<Directories id='directories' />
					</View>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	)
}

export default App
