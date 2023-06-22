export enum CONFIG {
	WAKATIME_API_ENDPOINT = 'https://api.wakatime.com/api/v1/users/current/heartbeats', // ?api_key=... will be append at the end
	STORAGE_PLUGIN_ENABLED = 'secure_wakatime_enabled',
	STORAGE_API_KEY = 'secure_wakatime_key',
	HEARTBEAT_INTERVAL = 12000, //* 2min interval
}

export enum ELEMENTS {
	API_KEY_INPUT = 'waka_key',
	API_KEY_SAVE_BTN = 'waka_submitkey',
	INPUT_ERROR_MESSAGE = 'waka_error_msg',
	API_CONNECTION_STATUS = 'connectionStatus',
	EXTENSION_ENABLED_CHECKBOX = 'waka_enabled',
}

export enum STATUS {
	BAD_REQUEST,
	INVALID_API_KEY,
	NO_API_KEY_PROVIDED,
	UNAUTHORIZED,
	CONNECTED,
}
