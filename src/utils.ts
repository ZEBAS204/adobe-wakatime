import { ELEMENTS, STATUS } from './constants'

export const updateConnectionStatus = (status: STATUS) => {
	const connectionStatus = document.getElementById(
		ELEMENTS.API_CONNECTION_STATUS
	)

	switch (status) {
		case STATUS.CONNECTED:
			connectionStatus.innerText = 'Connected'
			connectionStatus.setAttribute('class', 'positive')
			break

		case STATUS.INVALID_API_KEY:
		case STATUS.UNAUTHORIZED:
			connectionStatus.innerText = 'Unauthorized'
			connectionStatus.setAttribute('class', 'unauthorized')
			break

		case STATUS.SERVER_ERROR:
			connectionStatus.innerText = 'Unavailable'
			connectionStatus.setAttribute('class', 'negative')
			break

		default:
			connectionStatus.innerText = 'Disconnected'
			connectionStatus.setAttribute('class', 'negative')
	}
}
