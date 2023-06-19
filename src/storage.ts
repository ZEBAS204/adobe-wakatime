import { storage } from 'uxp'
const secureStorage = storage.secureStorage

let API_CACHE: string | null

export const saveSecureKey = async (): Promise<void> => {
	const userInput = document.getElementById('waka_key') as HTMLInputElement
	const errorMessage = document.getElementById('waka_error_msg')

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
	await secureStorage.setItem('secure_wakatime_key', key)
}

export const getApiKey = async () => {
	if (API_CACHE) return API_CACHE

	// We get the stored value from the secureStorage in the form of a uint8Array.
	const uintArray = await secureStorage.getItem('secure_wakatime_key')
	// We convert the uint8Array to a string to present it to the user.
	let secureKey = ''
	for (let i of uintArray) secureKey += String.fromCharCode(i)
	API_CACHE = secureKey
	return secureKey
}
