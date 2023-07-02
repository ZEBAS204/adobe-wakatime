// SWC innit
import '@spectrum-web-components/theme/sp-theme.js'
import '@spectrum-web-components/theme/src/themes.js'
// SWC Components
import '@spectrum-web-components/status-light/sp-status-light.js'
import '@spectrum-web-components/action-button/sp-action-button.js'
import '@spectrum-web-components/field-label/sp-field-label.js'
import '@spectrum-web-components/textfield/sp-textfield.js'
import '@spectrum-web-components/checkbox/sp-checkbox.js'
import '@spectrum-web-components/divider/sp-divider.js'
import '@spectrum-web-components/button/sp-button.js'
import '@spectrum-web-components/link/sp-link.js'
// Local
import { WakaTimePlugin } from './app'
import { HostInformation } from './utils'

const csInterface = new CSInterface()

// * UTIL
const asyncEvalScript = (script: string): Promise<string> => {
	return new Promise((resolve, _) => {
		csInterface.evalScript(script, resolve)
	})
}

const updateTheme = () => {
	const themeInfo = csInterface.getHostEnvironment().appSkinInfo
	const element = document.querySelector('sp-theme')

	if (!element || !themeInfo) return
	console.log('[WakaTime] Updating theme', themeInfo)

	const getRgbLightness = ({ red, green, blue }: { [key: string]: number }) => {
		if (!green || !red || !blue) return

		const max = Math.max(red, green, blue)
		const min = Math.min(red, green, blue)
		const lightness = Math.round((max + min) / 2)
		return lightness // should be a percentage, but is easier this way
	}

	// The lightness goes from 0 to 255, we just divide it into four (255/4 = 63.75)
	const LIGHT = 255 / 4
	const value = getRgbLightness(themeInfo.panelBackgroundColor.color)
	if (value === null) return

	let theme = null
	if (value <= LIGHT) theme = 'darkest'
	else if (value <= LIGHT * 2) theme = 'dark'
	else if (value <= LIGHT * 3) theme = 'lightest'
	else if (value <= LIGHT * 4) theme = 'light'

	console.log('[WakaTime] Updating "sp-theme" to', theme)
	const { red, green, blue } = themeInfo.panelBackgroundColor.color
	element.style.background = `rgb(${red},${green},${blue})`
	element.setAttribute('color', theme)
}

WakaTimePlugin.getActiveFile = async () => {
	const currentDocument = await asyncEvalScript('app.activeDocument.fullName')
	// ERROR 1302 === no active document
	if (currentDocument.startsWith('Error 1302:')) return null

	const realPath = await asyncEvalScript(`File('${currentDocument}').fsName`)
	const normalizedPath = realPath.replace(/\\/g, '/')

	console.log('Documents:', currentDocument, normalizedPath)
	return normalizedPath
}

HostInformation.init_CEP()
console.log('[WakaTime] Host name:', HostInformation.HOST_NAME)
WakaTimePlugin.initialize()
WakaTimePlugin.initListeners()

//* All links must be handled or else the extension will be used like a browser
document.querySelectorAll('sp-link')?.forEach((el) => {
	el.addEventListener('click', (event) => {
		event.preventDefault()
		const target = event.target as HTMLAnchorElement
		target?.href && csInterface.openURLInDefaultBrowser(target.href)
	})
})

// Init theme events
updateTheme()
csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, updateTheme, null)
