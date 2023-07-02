// SWC innit
import '@spectrum-web-components/theme/sp-theme.js'
import '@spectrum-web-components/theme/src/themes.js'
// SWC Components
import '@spectrum-web-components/status-light/sp-status-light.js'
import '@spectrum-web-components/field-label/sp-field-label.js'

// Local
import { app } from 'photoshop'
import { WakaTimePlugin } from './app'
import { HostInformation } from './utils'

WakaTimePlugin.getActiveFile = async () => {
	return app.activeDocument.path || app.activeDocument.name
}

HostInformation.init_UXP()
WakaTimePlugin.initialize()
WakaTimePlugin.initListeners()
