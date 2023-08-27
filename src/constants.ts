export const PLUGIN = {
	VERSION: require('../package.json').version.toString(),
	UPDATE_URL: 'https://api.github.com/repos/ZEBAS204/adobe-wakatime/releases/latest',
}

export enum CONFIG {
	WAKATIME_API_ENDPOINT = 'https://api.wakatime.com/api/v1/users/current/heartbeats', // ?api_key=... will be append at the end
	STORAGE_PLUGIN_ENABLED = 'secure_wakatime_enabled',
	STORAGE_API_KEY = 'secure_wakatime_key',
	STORAGE_MACHINE = 'secure_wakatime_machine',
	HEARTBEAT_INTERVAL = 120000, //* 2min interval
}

export enum ELEMENTS {
	API_KEY_INPUT = 'waka_key',
	API_HOSTNAME = 'waka_api_hostname',
	API_KEY_SAVE_BTN = 'waka_submitkey',
	CONFIG_RESET_BTN = 'waka_reset_config',
	CONFIG_SAVE_BTN = 'waka_save_config',
	INPUT_ERROR_MESSAGE = 'waka_error_msg',
	API_CONNECTION_STATUS = 'connectionStatus',
	EXTENSION_ENABLED_CHECKBOX = 'waka_enabled',
	EXTENSION_UPDATE_AVAILABLE = 'waka_update_available',
}

export enum STATUS {
	BAD_REQUEST,
	SERVER_ERROR,
	INVALID_API_KEY,
	NO_API_KEY_PROVIDED,
	UNAUTHORIZED,
	DISCONNECTED,
	CONNECTED,
}
