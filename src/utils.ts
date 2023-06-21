import * as fs from 'fs'
import { homedir } from 'os'
import { ELEMENTS } from './constants'

export const updateConnectionStatus = (isConnected: boolean) => {
	const connectionStatus = document.getElementById(
		ELEMENTS.API_CONNECTION_STATUS
	)
	connectionStatus.innerText = isConnected ? 'Connected' : 'Disconnected'
	connectionStatus.setAttribute('class', isConnected ? 'positive' : 'negative')
}

let CLI_DIR_CACHE: string = null
export const getCLIDir = async (): Promise<string | null> => {
	//* UNUSED FUNCTION
	//* Needs: manifest.requiredPermissions.localFileSystem = "fullAccess"
	if (CLI_DIR_CACHE) {
		console.log('[WakaTime] using dir cache')
		return CLI_DIR_CACHE
	}

	const binaryRegex = /wakatime-cli-[^.]*?(\.exe)?$/gi
	const homeDir = homedir()

	const cliLocation = path.resolve(path.join(homeDir, '.wakatime'))
	console.log('[WakaTime] Cli location:', cliLocation)

	let wakaFiles = null
	try {
		wakaFiles = fs.readdirSync(`file:/${cliLocation}`)
	} catch (err) {
		console.error('[WakaTime] Unable to scar wakatime user directory', err)
		return null
	}

	if (!wakaFiles?.length) {
		console.error('[WakaTime] No files found inside the directory!')
		return null
	}

	const binaryPath = wakaFiles.filter((file: string) => binaryRegex.test(file))
	console.log('[WakaTime] binary:', binaryPath)
	if (binaryPath) {
		const binary = path.normalize(path.join(cliLocation, binaryPath[0]))
		console.log(`[WakaTime] Found wakatime-cli location: ${binary}`)
		CLI_DIR_CACHE = binary
		return binary
	}

	console.log('[WakaTime] No binary found')
	return null
}
