const { secureStorage } = require('uxp').storage
import { CONFIG, ELEMENTS } from './constants'

let API_CACHE: string | null

export const saveSecureKey = async (): Promise<void> => {
	const userInput = document.getElementById(
		ELEMENTS.API_KEY_INPUT
	) as HTMLInputElement
	const errorMessage = document.getElementById(ELEMENTS.INPUT_ERROR_MESSAGE)

	//* MAC bug fix: can't read input as password.
	userInput.type = 'text'
	const key = userInput.value
	userInput.type = 'password'

	// API keys start with waka_
	if (!key.length || !key.startsWith('waka_')) {
		errorMessage.textContent = 'Invalid API key'
		return
	}
	errorMessage.textContent = ''

	API_CACHE = key
	await secureStorage.setItem(CONFIG.STORAGE_API_KEY, key)
}

export const getApiKey = async () => {
	if (API_CACHE) return API_CACHE

	// We get the stored value from the secureStorage in the form of a uint8Array.
	const uintArray = await secureStorage.getItem(CONFIG.STORAGE_API_KEY)
	// We convert the uint8Array to a string to present it to the user.
	let secureKey = ''
	for (let i of uintArray) secureKey += String.fromCharCode(i)
	API_CACHE = secureKey
	return secureKey
}
