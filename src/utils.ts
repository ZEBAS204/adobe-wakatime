import { ELEMENTS, STATUS } from './constants'

export const updateConnectionStatus = (status: STATUS) => {
	const connectionStatus = document.getElementById(
		ELEMENTS.API_CONNECTION_STATUS
	)

	switch (status) {
		case STATUS.CONNECTED:
			connectionStatus.innerText = 'Connected'
			connectionStatus.setAttribute('variant', 'positive')
			break

		case STATUS.INVALID_API_KEY:
		case STATUS.UNAUTHORIZED:
			connectionStatus.innerText = 'Unauthorized'
			connectionStatus.setAttribute('variant', 'notice')
			break

		case STATUS.SERVER_ERROR:
			connectionStatus.innerText = 'Unavailable'
			connectionStatus.setAttribute('variant', 'negative')
			break

		default:
			connectionStatus.innerText = 'Disconnected'
			connectionStatus.setAttribute('class', 'negative')
	}
}
