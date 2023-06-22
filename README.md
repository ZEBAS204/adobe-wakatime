# Wakatime Adobe Photoshop Plugin

The Wakatime plugin is a powerful integration that brings [Wakatime](https://wakatime.com/)'s time-tracking functionality to Adobe Photoshop.

By default, the plugin will show in your dashboard like this:

- **Language:** `{app_name}` (uppercase, eg. `Photoshop`)
- **Project name:** `adobe-{app_name}` (lowercase, eg. `adobe-photoshop`)
- **Editor:** `Adobe-{app_name}` (uppercase, eg. `Adobe-Photoshop`)
- **Category:** Designing

You can modify the project names, languages, category, etc. using the [Custom rules](https://wakatime.com/settings/rules) in your dashboard.

## Supported Adobe Applications

This plugin uses **Adobe Manifest v5**. Versions after `23.3.0` (UXP 6.0 or higher) should work as intended.
While older versions may also work, please note that they are not officially supported.

> **NOTE**
> Requires an internet connection and **will not track** time while offline.

## Installation

1. Download the latest version of the plugin from the [Releases page](https://github.com/ZEBAS204/adobe_wakatime/releases) or [click here to download directly](https://github.com/ZEBAS204/adobe_wakatime/releases/latest/download/wakatime-adobe.zip)
2. Locate the plugins folder:
  - **Windows:** `C:\Program Files\Adobe\Adobe Photoshop 20xx\Plug-ins/`
  - **macOS:** `~/Library/Applications/Adobe Photoshop 20xx/Plug-ins/`
3. Extract the `wakatime-adobe` folder from the downloaded zip file into the `Plug-ins` folder.


## Usage

1. Open Adobe Photoshop after you installed this plugin.
2. Select **Plugins > Wakatime** in the toolbar or go to the **Plugins panel** and choose **Plugins > Plugins panel > Wakatime**.
3. Paste your **API key** into the input field and click the **Save** button ([Get your API key here](https://wakatime.com/api-key)).
4. The `status` should automatically update if the plugin is tracking time (it sends data every 2 minutes)
   - If it still shows "Disconnected," make sure you have an open file for the plugin to work. Don't worry if it initially shows "Disconnected" before you open a file.
5. To disable the plugin, **uncheck** the "Plugin enabled" checkbox.

### Status meaning

- **Status: Connected** - The plugin is working as intended.
- **Status: Disconnected** - The plugin only works when you have an open file and an internet connection. Make sure you have an open file and you are not on the Home screen.
- **Status: Unauthorized** - The provided API key is likely invalid, or you do not have permission to access the resource.
- **Status: Unavailable** - The server responded with an `error 500` and is currently unavailable.
- **Status: Disconnected (despite being working before)** - The plugin may have sent too many requests in a short period and hit a rate limit.

> **Note**
> **The status may show "Disconnected" for any connection error or bad request.**

---

## Development

### Prerequisites

1. Install [Adobe UXP Developer Tool](https://github.com/adobe-uxp/devtools-cli). Please, follow the instructions in the repository.
2. Load this plugin directly in Photoshop using the UXP Developer Tools application. Once started, click "Add Plugin..." and navigate to the "[manifest.json](plugin/manifest.json)" file in this folder.
3. If the plugin was not automatically loaded, click "Load" in the action dropdown menu (three dots)
4. Click "Watch" in the action dropdown menu (three dots)

### Installation

To install the dependencies, run the following command:

```shell
npm install
```

After installing the dependencies, build the plugin's `plugin/index.js` file (loaded by `index.html`) by running:

```shell
npm run build
```

Internally, this command runs `webpack` and builds `plugin/index.js` from the `src/index.ts` file.

### Watch mode

To automatically build the code whenever changes are made, start the watch mode (ensure UXP is watching the plugin folder, see [Prerequisites](#prerequisites)) by running:

```shell
npm run watch
```

---

Based on [UXP Photoshop Plugin Samples: Photoshop TypeScript / Webpack Sample](https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/tree/main/typescript-webpack-sample)
