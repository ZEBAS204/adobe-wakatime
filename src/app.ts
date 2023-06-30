import './styles.css'
import { ELEMENTS, CONFIG, STATUS } from './constants'
import { updateConnectionStatus } from './utils'
import { sendHeartbeat } from './wakatime'
import Storage from './storage'

export class WakaTimePlugin {
	private static intervalRef: NodeJS.Timer | null = null

	public static async getActiveFile(): Promise<any> {}

	public static initialize(): void {
		console.log('[WakaTime] Initializing WakaTime plugin')
		console.log(`[WakaTime] Heartbeat interval: ${CONFIG.HEARTBEAT_INTERVAL}ms`)

		if (Storage.isExtensionEnabled()) this.init()
	}

	public static stop(): void {
		clearInterval(this.intervalRef)
	}

	public static init(): void {
		if (!Storage.isExtensionEnabled()) {
			updateConnectionStatus(STATUS.DISCONNECTED)
			return
		}

		this.intervalRef = setInterval(async () => {
			const activeFile = await this.getActiveFile()
			console.log('Active file:', activeFile)
			if (!activeFile) return

			const heartbeatResponse = await sendHeartbeat({
				file: activeFile,
				time: Date.now(),
			})

			console.log('heartbeat response:', heartbeatResponse)
			updateConnectionStatus(heartbeatResponse)
		}, CONFIG.HEARTBEAT_INTERVAL)
	}

	public static initListeners(): void {
		document
			.getElementById(ELEMENTS.API_KEY_SAVE_BTN)
			?.addEventListener('click', this.handleApiKeySaveClick)

		document
			.getElementById(ELEMENTS.EXTENSION_ENABLED_CHECKBOX)
			?.addEventListener('change', this.handleExtensionEnabledClick)

		document
			.getElementById(ELEMENTS.CONFIG_SAVE_BTN)
			?.addEventListener('click', this.handleConfigSaveClick)

		document
			.getElementById(ELEMENTS.CONFIG_RESET_BTN)
			?.addEventListener('click', this.handleConfigResetClick)
	}

	private static handleApiKeySaveClick = async (): Promise<void> => {
		console.log('[WakaTime] Updating API key')
		await Storage.saveSecureKey()
		this.init()
	}

	private static handleExtensionEnabledClick = (): void => {
		Storage.saveIsEnabled()
		this.init()
	}

	private static handleConfigSaveClick = (): void => {
		Storage.manageStorage()
		this.init()
	}

	private static handleConfigResetClick = (): void => {
		Storage.manageStorage(true)
		this.init()
	}
}
