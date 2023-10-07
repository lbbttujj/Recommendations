import './index.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import bridge from '@vkontakte/vk-bridge'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from 'store'

import App from './App'
import reportWebVitals from './reportWebVitals'

bridge.send('VKWebAppInit')

const client = new ApolloClient({
	uri: 'http://localhost:3006/graphql',
	cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<App />
		</Provider>
	</ApolloProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
