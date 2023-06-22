import { app } from 'photoshop'
import { saveSecureKey } from './storage'
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

const init = async () => {
	clearInterval(intervalRef)
	intervalRef = setInterval(async () => {
		const activeFile = app.activeDocument.name
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
	init()
})()
