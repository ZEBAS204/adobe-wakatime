import { ELEMENTS, STATUS } from './constants'
import Storage from './storage'

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
			connectionStatus.setAttribute('variant', 'negative')
	}
}

export class HostInformation {
	public static APP_NAME: string
	public static PLUGIN_NAME: string
	public static USER_AGENT: string
	public static HOST_NAME: string | null

	public static init_UXP(): void {
		const { platform, arch } = require('os')
		const { host, versions } = require('uxp')
		// Wakatime uses the user agent to identify the application, OS and extension.
		const APP_NAME = host.name as string
		const APP_NAME_L = APP_NAME.toLocaleLowerCase()
		const PLUGIN_NAME = `adobe-${APP_NAME_L}-wakatime/${versions.plugin}`
		// We need to remove any numbers from the platform as win32/win10 is not recognized and will be
		// labeled as Unknown OS. Wakatime accepts {os_name}_{os_version} format.
		const AGENT_OS = `${platform().replace(/\d/g, '')}_${arch()}`
		const USER_AGENT = `${APP_NAME}/${host.version} ${AGENT_OS} ${PLUGIN_NAME}`

		this.APP_NAME = APP_NAME
		this.PLUGIN_NAME = PLUGIN_NAME
		this.USER_AGENT = USER_AGENT
		this.HOST_NAME = Storage.getMachineName()
	}

	static init_CEP(): void {
		const { platform, arch, hostname } = require('os')

		const csInterface = new CSInterface() as any
		const HOST_INFO = csInterface.getHostEnvironment()
		const APP_NAME = (() => {
			const ids = {
				PHXS: 'Photoshop',
				PHSP: 'Photoshop',
				IDSN: 'InDesign',
				AICY: 'InCopy',
				ILST: 'Illustrator',
				PPRO: 'Premiere',
				PRLD: 'Prelude',
				AEFT: 'After',
				FLPR: 'Animate',
				AUDT: 'Audition',
				DRWV: 'Dreamweaver',
				KBRG: 'Bridge',
				RUSH: 'Rush',
			}
			const appId = HOST_INFO.appId as keyof typeof ids
			const name = ids[appId] || 'UNKNOWN'

			console.log('[WakaTime] App name:', name, appId)
			return name
		})()

		const PLUGIN_NAME = `adobe-${APP_NAME.toLowerCase()}-wakatime/1.0.0`
		const AGENT_OS = `${platform().replace(/\d/g, '')}_${arch()}`
		const USER_AGENT = `${APP_NAME}/${HOST_INFO.appVersion} ${AGENT_OS} ${PLUGIN_NAME}`

		this.APP_NAME = APP_NAME
		this.PLUGIN_NAME = PLUGIN_NAME
		this.USER_AGENT = USER_AGENT
		this.HOST_NAME = hostname()
	}
}
