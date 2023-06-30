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

	let theme = null
	switch (JSON.stringify(themeInfo.panelBackgroundColor.color)) {
		case '{"alpha":255,"green":240,"blue":240,"red":240}':
			theme = 'light'
			break
		case '{"alpha":255,"green":184,"blue":184,"red":184}':
			theme = 'lightest'
			break
		case '{"alpha":255,"green":83,"blue":83,"red":83}':
			theme = 'dark'
			break
		case '{"alpha":255,"green":50,"blue":50,"red":50}':
			theme = 'darkest'
			break
	}
	if (theme) {
		console.log('[WakaTime] Updating "sp-theme" to', theme)
		element.setAttribute('color', theme)
	}
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
csInterface.addEventListener(
	CSInterface.THEME_COLOR_CHANGED_EVENT,
	updateTheme,
	null
)
