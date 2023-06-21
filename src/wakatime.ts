import { host, versions } from 'uxp'
import { platform, arch } from 'os'
import { getApiKey } from './storage'

const APP_NAME = host.name.toLowerCase()
const PLUGIN_NAME = `adobe-${APP_NAME}-wakatime`
const AGENT_OS = `${platform()}_${arch()}`
const USER_AGENT = `${APP_NAME}/${host.version} ${AGENT_OS} ${PLUGIN_NAME}/${versions.plugin}`

export const sendHeartbeat = async ({
	file,
	time,
}: {
	file?: string
	time?: number
}) => {
	const apiKey = await getApiKey()
	if (!apiKey) {
		console.error('[WakaTime] No API key provided for sendHearteat()')
		return
	}
	try {
		const payload = {
			time: Math.floor(time / 1000),
			entity: file,
			type: 'file',
			project: `Adobe-${APP_NAME}`,
			category: 'designing',
			language: APP_NAME,
			plugin: PLUGIN_NAME,
		}

		await fetch(
			`https://api.wakatime.com/api/v1/users/current/heartbeats?api_key=${apiKey}`,
			{
				method: 'POST',
				credentials: 'omit',
				body: JSON.stringify(payload),
				redirect: 'follow',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': USER_AGENT,
				},
			}
		)
	} catch (err) {
		console.error('[WakaTime] Error:', err)
	}
}
