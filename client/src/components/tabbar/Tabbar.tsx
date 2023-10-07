import {
	Icon24Users3Outline,
	Icon28FolderSimpleOutline,
	Icon32SearchOutline,
} from '@vkontakte/icons'
import { Tabbar, TabbarItem } from '@vkontakte/vkui'
import React from 'react'

type TabItemType = {
	onStoryChange: (e: React.MouseEvent<HTMLElement>) => void
	activeStory: string
}
export const TabBarComponent: React.FC<TabItemType> = ({
	onStoryChange,
	activeStory,
}) => {
	return (
		<Tabbar>
			<TabbarItem
				selected={activeStory === 'searchPage'}
				data-story='searchPage'
				onClick={onStoryChange}
				text='Поиск'
			>
				<Icon32SearchOutline />
			</TabbarItem>
			<TabbarItem
				selected={activeStory === 'directories'}
				data-story='directories'
				onClick={onStoryChange}
				text='Папки'
			>
				<Icon28FolderSimpleOutline />
			</TabbarItem>
			<TabbarItem
				selected={activeStory === 'socialPage'}
				data-story='socialPage'
				onClick={onStoryChange}
				text='Друзья'
			>
				<Icon24Users3Outline />
			</TabbarItem>
		</Tabbar>
	)
}
