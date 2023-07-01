import { CONFIG, STATUS } from './constants'
import { HostInformation } from './utils'
import Storage from './storage'

interface HeartbeatData {
	file: string
	time: number
}
export const sendHeartbeat = async (data: HeartbeatData): Promise<STATUS> => {
	const { file, time } = data
	console.log('[WakaTime] Sending heartbeat:', file)

	const apiKey = await Storage.getApiKey()
	if (!apiKey) {
		console.error('[WakaTime] No API key provided for sendHearteat()')
		return STATUS.NO_API_KEY_PROVIDED
	}

	const response = await fetch(
		`${CONFIG.WAKATIME_API_ENDPOINT}?api_key=${apiKey}`,
		{
			method: 'POST',
			credentials: 'omit',
			redirect: 'follow',
			body: JSON.stringify({
				//* Time must be in UNIX timestamp
				time: Math.floor(time / 1000),
				entity: file,
				type: 'file',
				project: `Adobe ${HostInformation.APP_NAME}`,
				category: 'designing',
				language: HostInformation.APP_NAME,
				plugin: HostInformation.PLUGIN_NAME,
			}),
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': HostInformation.USER_AGENT,
				// Machine header must be checked, if not, any value will be stringified
				...(HostInformation.HOST_NAME && {
					'X-Machine-Name': HostInformation.HOST_NAME,
				}),
			},
		}
	)
		.then((res) => {
			console.log('[WakaTime] Heartbeat received', res)
			if (res.status === 500) return STATUS.SERVER_ERROR
			else if (res.status === 401 || res.status === 403)
				return STATUS.INVALID_API_KEY
			else if (!res.ok) return STATUS.BAD_REQUEST

			return STATUS.CONNECTED
		})
		.catch((err) => {
			console.error('[WakaTime] Fetch error\n', err)
			return STATUS.BAD_REQUEST
		})

	return response
}
