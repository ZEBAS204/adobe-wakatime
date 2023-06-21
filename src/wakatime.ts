const { host, versions } = require('uxp')
import { platform, arch } from 'os'
import { getApiKey } from './storage'
import { CONFIG, STATUS } from './constants'

// Wakatime uses the user agent to identify the application, OS and extension.
const APP_NAME = (host.name as string).toLowerCase()
const PLUGIN_NAME = `adobe-${APP_NAME}-wakatime`
const AGENT_OS = `${platform()}_${arch()}`
const USER_AGENT = `${APP_NAME}/${host.version} ${AGENT_OS} ${PLUGIN_NAME}/${versions.plugin}`

export const sendHeartbeat = async ({
	file,
	time,
}: {
	file?: string
	time?: number
}): Promise<STATUS> => {
	console.log('[WakaTime] Sending heartbeat:', file)

	const apiKey = await getApiKey()
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
				project: `adobe-${APP_NAME}`,
				category: 'designing',
				language: APP_NAME,
				plugin: PLUGIN_NAME,
			}),
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': USER_AGENT,
			},
		}
	)
		.then((res) => {
			console.log('[WakaTime] Heartbeat received', res)
			if (res.status === 401) return STATUS.INVALID_API_KEY
			if (!res.ok) return STATUS.BAD_REQUEST

			return STATUS.CONNECTED
		})
		.catch((err) => {
			console.error('[WakaTime] Fetch error\n', err)
			return STATUS.BAD_REQUEST
		})

	return response
}
