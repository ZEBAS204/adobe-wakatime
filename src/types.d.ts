import type * as PATH from 'path'
import type * as lodash from 'lodash'

// Basic declarations as `any` until proper UXP types exist:
// https://developer.adobe.com/photoshop/uxp/2022/uxp-api/reference-js/Modules/uxp/
declare module 'uxp'
// https://developer.adobe.com/photoshop/uxp/2022/uxp-api/reference-js/Modules/os/OS/
declare module 'os'

// This makes types available globally.
// Photoshop set those at runtime
declare global {
	const _: typeof lodash
	const path: typeof PATH
}
