const { host, versions } = require('uxp')
import { platform, arch } from 'os'
import { getApiKey } from './storage'
import { CONFIG, STATUS } from './constants'

// Wakatime uses the user agent to identify the application, OS and extension.
const APP_NAME = host.name as string
const APP_NAME_L = APP_NAME.toLocaleLowerCase()
const PLUGIN_NAME = `adobe-${APP_NAME_L}-wakatime/${versions.plugin}`
// We need to remove any numbers from the platform as win32/win10 is not recognized and will be
// labeled as Unknown OS. Wakatime accepts {os_name}_{os_version} format.
const AGENT_OS = `${platform().replace(/\d/g, '')}_${arch()}`
const USER_AGENT = `${APP_NAME}/${host.version} ${AGENT_OS} ${PLUGIN_NAME}`

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
				project: `adobe-${APP_NAME_L}`,
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
