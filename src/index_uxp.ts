import { app } from 'photoshop'
import { WakaTimePlugin } from './app'
import { HostInformation } from './utils'

WakaTimePlugin.getActiveFile = async () => {
	return app.activeDocument.path || app.activeDocument.name
}

HostInformation.init_UXP()
WakaTimePlugin.initialize()
WakaTimePlugin.initListeners()
