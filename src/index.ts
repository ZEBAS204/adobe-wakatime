import { app } from 'photoshop'
import { saveSecureKey, saveIsEnabled, isExtensionEnabled } from './storage'
import { sendHeartbeat } from './wakatime'
import { updateConnectionStatus } from './utils'
import { ELEMENTS, CONFIG } from './constants'

let intervalRef: NodeJS.Timer = null

document
	.getElementById(ELEMENTS.API_KEY_SAVE_BTN)
	?.addEventListener('click', async () => {
		console.log('[WakaTime] Updating API key')
		await saveSecureKey()
		init()
	})

document
	.getElementById(ELEMENTS.EXTENSION_ENABLED_CHECKBOX)
	?.addEventListener('click', () => {
		saveIsEnabled()
		init()
	})

const init = async () => {
	clearInterval(intervalRef)
	if (!isExtensionEnabled()) return

	intervalRef = setInterval(async () => {
		const activeFile = app.activeDocument.path || app.activeDocument.name
		if (!activeFile) return
		const heartbeatResponse = await sendHeartbeat({
			file: activeFile,
			time: Date.now(),
		})
		console.log('heartbeat response:', heartbeatResponse)
		updateConnectionStatus(heartbeatResponse)
	}, CONFIG.HEARTBEAT_INTERVAL)
}

;(async () => {
	console.log('[WakaTime] Initializing WakaTime plugin')
	console.log('[WakaTime] Heartbeat interval:', CONFIG.HEARTBEAT_INTERVAL)

	if (isExtensionEnabled()) init()
})()
