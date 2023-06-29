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

const registerEvents = ({ data: isOpen }: { data: boolean }) => {
	console.log('[WakaTime] Adding events')
	if (!isOpen) return

	WakaTimePlugin.initListeners()

	// Remove the event
	csInterface.removeEventListener(
		'com.adobe.csxs.events.WindowVisibilityChanged',
		registerEvents,
		null
	)
}
csInterface.addEventListener(
	'com.adobe.csxs.events.WindowVisibilityChanged',
	registerEvents,
	null
)

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
